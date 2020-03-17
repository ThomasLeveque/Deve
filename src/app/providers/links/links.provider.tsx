import React, { createContext, useState, useEffect, memo } from 'react';
import { useQueryParam, StringParam } from 'use-query-params';

import { firestore } from '../../firebase/firebase.service';
import { LINKS_PER_PAGE } from '../../utils';
import { Link } from '../../models/link.model';
import { ICreateLinkInitialState } from '../../interfaces/initial-states.type';
import Category from '../../models/category.model';
import CurrentUser from '../../models/current-user.model';
import { IVote } from '../../interfaces/vote.interface';
import { IComment } from '../../interfaces/comment.interface';

interface ILinks {
  [id: string]: Link;
}

type UpdateVoteLinksType = 'add' | 'remove';

interface ILinksContext {
  loadMoreLinks: () => Promise<any>;
  addLink: (values: ICreateLinkInitialState, categories: Category[], currentUser: CurrentUser) => Promise<void>;
  updateVoteLinks: (linkId: string, currentUser: CurrentUser, type: UpdateVoteLinksType) => Promise<void>;
  addCommentLink: (commentText: string, linkId: string, currentUser: CurrentUser) => Promise<void>;
  links: ILinks;
  linksLoaded: boolean;
  loadingMoreLinks: boolean;
  hasMoreLinks: boolean;
}

export const LinksContext = createContext<ILinksContext>({
  loadMoreLinks: null,
  addLink: null,
  updateVoteLinks: null,
  addCommentLink: null,
  links: {},
  linksLoaded: false,
  loadingMoreLinks: false,
  hasMoreLinks: true
});

const LinksProvider: React.FC = memo(({ children }) => {
  const [links, setLinks] = useState<ILinks>({});
  const [linksLoaded, setLinksLoaded] = useState<boolean>(false);
  const [loadingMoreLinks, setLoadingMoreLinks] = useState<boolean>(false);
  const [hasMoreLinks, setHasMoreLinks] = useState<boolean>(true);
  const [cursor, setCursor] = React.useState<firebase.firestore.DocumentSnapshot>(null);

  const [qsSortby] = useQueryParam('sortby', StringParam);
  const [qsCategory] = useQueryParam('category', StringParam);

  const getQuery = (): firebase.firestore.Query => {
    let linkRef: firebase.firestore.Query = firestore.collection('links');

    if (qsCategory) {
      linkRef = linkRef.where('category', '==', qsCategory);
    }

    if (!qsSortby || qsSortby === 'recent') {
      linkRef = linkRef.orderBy('createdAt', 'desc');
    } else if (qsSortby === 'liked') {
      linkRef = linkRef.orderBy('voteCount', 'desc');
    } else {
      linkRef = linkRef.orderBy('createdAt', 'asc');
    }

    return linkRef;
  };

  const loadMoreLinks = async (): Promise<any> => {
    if (cursor) {
      setLoadingMoreLinks(true);
      const snapshot: firebase.firestore.QuerySnapshot = await getQuery()
        .startAfter(cursor)
        .limit(LINKS_PER_PAGE)
        .get();
      let links: { [id: string]: Link } = {};
      snapshot.docs.map((doc: firebase.firestore.DocumentSnapshot) => (links[doc.id] = new Link(doc)));
      const _cursor = snapshot.docs[snapshot.docs.length - 1];
      setHasMoreLinks(!snapshot.empty);
      setLoadingMoreLinks(false);
      setLinks(prevLinks => ({ ...prevLinks, ...links }));
      setCursor(_cursor);
    }
  };

  const addLink = async (
    { url, description, category }: ICreateLinkInitialState,
    categories: Category[],
    currentUser: CurrentUser
  ): Promise<void> => {
    try {
      const { id, displayName } = currentUser;
      const newLink: Link = {
        url,
        description,
        category,
        postedBy: {
          id,
          displayName
        },
        voteCount: 0,
        votes: [],
        comments: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      const selectedCategory = categories.find((_category: Category) => _category.name === category);
      selectedCategory.count++;
      const categoryRef: firebase.firestore.DocumentReference = firestore.doc(`categories/${selectedCategory.id}`);
      const linksRef: firebase.firestore.CollectionReference = firestore.collection('links');

      const [linkRef] = await Promise.all([
        linksRef.add(newLink),
        categoryRef.set({
          name: selectedCategory.name,
          count: selectedCategory.count
        })
      ]);
      const linkSnapshot: firebase.firestore.DocumentSnapshot = await linkRef.get();
      const newLinkFromFirestore = new Link(linkSnapshot);
      setLinks(prevLinks => ({ [linkSnapshot.id]: newLinkFromFirestore, ...prevLinks }));
    } catch (err) {
      console.error('Cannot add link:', err.message || err.toString());
    }
  };

  const addCommentLink = async (commentText: string, linkId: string, currentUser: CurrentUser) => {
    const commentRef: firebase.firestore.DocumentReference = firestore.collection('links').doc(linkId);

    try {
      const previousComments: IComment[] = links[linkId].comments;
      const comment: IComment = {
        postedBy: { id: currentUser.id, displayName: currentUser.displayName },
        created: Date.now(),
        text: commentText
      };
      const updatedComments: IComment[] = [...previousComments, comment];

      links[linkId].comments = updatedComments;
      setLinks({ ...links });

      try {
        commentRef.update({ comments: updatedComments });
      } catch (err) {
        links[linkId].comments = previousComments;
        setLinks({ ...links });
        console.error(`Cannot update ${linkId} link`, err.message || err.toString());
      }
    } catch (err) {
      console.error(`Cannot get ${linkId} link`, err.message || err.toString());
    }
  };

  const updateVoteLinks = async (linkId: string, currentUser: CurrentUser, type: UpdateVoteLinksType) => {
    const voteRef: firebase.firestore.DocumentReference = firestore.collection('links').doc(linkId);

    try {
      const previousVotes: IVote[] = links[linkId].votes;
      const { id, displayName } = currentUser;
      const vote: IVote = {
        voteBy: { id, displayName }
      };
      let updatedVotes: IVote[];
      if (type === 'add') {
        updatedVotes = [...previousVotes, vote];
      } else {
        updatedVotes = previousVotes.filter((vote: IVote) => vote.voteBy.id !== currentUser.id);
      }
      const voteCount = updatedVotes.length;

      links[linkId].votes = updatedVotes;
      links[linkId].voteCount = voteCount;
      setLinks({ ...links });
      try {
        voteRef.update({ votes: updatedVotes, voteCount });
      } catch (err) {
        links[linkId].votes = previousVotes;
        links[linkId].voteCount = previousVotes.length;
        setLinks({ ...links });
        console.error(`Cannot update ${linkId} link`, err.message || err.toString());
      }
    } catch (err) {
      console.error(`Cannot get ${linkId} link`, err.message || err.toString());
    }
  };

  useEffect(() => {
    const asyncEffect = async () => {
      setLinksLoaded(false);
      const snapshot: firebase.firestore.QuerySnapshot = await getQuery()
        .limit(LINKS_PER_PAGE)
        .get();
      let links: { [id: string]: Link } = {};
      snapshot.docs.map((doc: firebase.firestore.DocumentSnapshot) => (links[doc.id] = new Link(doc)));
      const _cursor = snapshot.docs[snapshot.docs.length - 1];
      setHasMoreLinks(!snapshot.empty);
      setLinksLoaded(true);
      setCursor(_cursor);
      setLinks(links);
    };
    asyncEffect();
  }, [qsCategory, qsSortby]);

  return (
    <LinksContext.Provider
      value={{ loadMoreLinks, links, linksLoaded, loadingMoreLinks, hasMoreLinks, addLink, updateVoteLinks, addCommentLink }}
    >
      {children}
    </LinksContext.Provider>
  );
});

export default LinksProvider;
