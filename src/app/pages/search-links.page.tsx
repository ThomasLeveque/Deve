import React from 'react';
import FirebaseContext from '../firebase/firebase.context';
import LinkItem from '../components/link-item/link-item';
import { ILink, ICategory } from '../interfaces/link.interface';

const SearchLinksPage: React.FC = () => {
  const { firebase, categories } = React.useContext(FirebaseContext);

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
    const snapshot: firebase.firestore.QuerySnapshot = await firebase.db
      .collection('links')
      .get();

    const links: ILink[] = snapshot.docs.map((doc: any) => {
      return { id: doc.id, ...doc.data() };
    });
    setLinks(links);
  };

  const getLinksByCategory = async (categoryName: string): Promise<void> => {
    const _categoryName = categoryName.toLocaleLowerCase();
    const snapshot: firebase.firestore.QuerySnapshot = await firebase.db
      .collection('links')
      .where('category', '==', _categoryName)
      .get();

    const links: ILink[] = snapshot.docs.map((doc: any) => {
      return { id: doc.id, ...doc.data() };
    });
    setFilteredLinks(links);
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <div>
          Search{' '}
          <input
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setFilter(event.target.value)
            }
          />
          <button>Ok</button>
        </div>
      </form>
      {categories.map((category: ICategory) => (
        <button
          onClick={() => getLinksByCategory(category.name)}
          key={category.id}
          style={{
            backgroundColor: '#ff6600',
            color: 'white',
            padding: '4px 8px',
            margin: '5px 5px 0 0',
            borderRadius: '40px',
            border: '0'
          }}
        >
          {category.name}
        </button>
      ))}
      {!filteredLinks.length && <p>No results</p>}
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

export default SearchLinksPage;
