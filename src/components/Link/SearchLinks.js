import React from 'react';
import FirebaseContext from '../../firebase/context';
import LinkItem from './LinkItem';

function SearchLinks() {
  const { firebase } = React.useContext(FirebaseContext);
  const [filteredLinks, setFilteredLinks] = React.useState([]);
  const [links, setLinks] = React.useState([]);
  const [filter, setFilter] = React.useState('');

  const handleSearch = e => {
    e.preventDefault();
    const query = filter.toLowerCase();
    const matchedLinks = links.filter(link => {
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

  const getInitialLinks = async () => {
    const snapshot = await firebase.db.collection('links').get();

    const links = snapshot.docs.map(doc => {
      return { id: doc.ic, ...doc.data() };
    });
    setLinks(links);
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <div>
          Search <input onChange={event => setFilter(event.target.value)} />
          <button>Ok</button>
        </div>
      </form>
      {filteredLinks.map((filteredLink, index) => (
        <LinkItem
          key={filteredLink.id}
          showCount={false}
          link={filteredLink}
          index={index}
        />
      ))}
    </div>
  );
}

export default SearchLinks;
