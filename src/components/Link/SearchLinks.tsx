import React from 'react';
import FirebaseContext from '../../firebase/context';
import LinkItem from './LinkItem';
import { ILink } from '../../interfaces/link';

const SearchLinks: React.FC = () => {
  const { firebase } = React.useContext(FirebaseContext);

  const [filteredLinks, setFilteredLinks] = React.useState<ILink[]>([]);
  const [links, setLinks] = React.useState<ILink[]>([]);
  const [filter, setFilter] = React.useState<string>('');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const query = filter.toLowerCase();
    const matchedLinks: ILink[] = links.filter((link: ILink) => {
      return (
        link.description.toLowerCase().includes(query) ||
        link.url.toLowerCase().includes(query) ||
        link.postedBy.name.toLowerCase().includes(query)
      );
    });

    setFilteredLinks(matchedLinks);
  };

  React.useEffect(() => {
    getInitialLinks();
  }, []);

  const getInitialLinks = async (): Promise<void> => {
    const snapshot: firebase.firestore.QuerySnapshot = await firebase.db.collection('links').get();

    const links: ILink[] = snapshot.docs.map((doc: any) => {
      return { id: doc.ic, ...doc.data() };
    });
    setLinks(links);
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <div>
          Search <input onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFilter(event.target.value)} />
          <button>Ok</button>
        </div>
      </form>
      {filteredLinks.map((filteredLink: ILink, index: number) => (
        <LinkItem
          key={filteredLink.id}
          showCount={false}
          link={filteredLink}
          index={index}
        />
      ))}
    </div>
  );
};

export default SearchLinks;
