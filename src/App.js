import React from 'react';
import './App.css';
import axios from 'axios';
import Avatar from '@material-ui/core/Avatar';

function Champion({ name, cost, traits }) {
	const nameDense = name.replace(' ', '').replace("'", '');
	const imgLink = `dataset/champions/${nameDense}.png`;
	return <React.Fragment><Avatar alt={name} src={imgLink} /></React.Fragment>;
}

class App extends React.Component {
  constructor(props) {
	super(props);
	this.state = { champs: [], };
  }
  componentDidMount() {
	  console.log('loaded');
	  axios.get('dataset/champions.json')
	  .then((response) => {
		  if (response.request.status === 200) {
			  this.setState( { champs: [...response.data].sort((a,b)=> a.cost - b.cost) } );
		  }
	  });
  }
  render() {
	  return (
		<div className="App">
		  <header className="App-header">
		  {this.state.champs.map((champ, i) => {
				return (<Champion name={champ.name} cost={champ.cost} traits={champ.traits} key={i} />);
		  })}
		  </header>
		</div>
	  );
  }
}

export default App;
