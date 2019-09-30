
// /client/App.js
import React, { Component } from 'react';
import axios from 'axios';
import './app.css';

class App extends Component {
  // initialize our state
  state = {
    data: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null,
  };

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has
  // changed and implement those changes into our UI
  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  // never let a process live forever
  // always kill a process everytime we are done using it
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  // just a note, here, in the front end, we use the id key of our data object
  // in order to identify which we want to Update or delete.
  // for our back end, we use the object id assigned by MongoDB to modify
  // data base entries

  // our first get method that uses our backend api to
  // fetch data from our data base
  getDataFromDb = () => {
    fetch('/api/getData')
      .then((data) => data.json())
      .then((res) => this.setState({ data: res.data }));
  };

  // our put method that uses our backend api
  // to create new query into our data base
  putDataToDB = (message) => {
    document.querySelector('input').value = ''
    let currentIds = this.state.data.map((data) => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post('/api/putData', {
      id: idToBeAdded,
      message: message,
    });
  };

  // our delete method that uses our backend api
  // to remove existing database information
  deleteFromDB = (idTodelete) => {
    parseInt(idTodelete);
    let objIdToDelete = null;
    this.state.data.forEach((dat) => {
      if (dat.id === idTodelete) {
        objIdToDelete = dat._id;
      }
    });

    axios.delete('/api/deleteData', {
      data: {
        id: objIdToDelete,
      },
    });
  };

  // our update method that uses our backend api
  // to overwrite existing data base information
  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    parseInt(idToUpdate);
    this.state.data.forEach((dat) => {
      if (dat.id === idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    axios.post('/api/updateData', {
      id: objIdToUpdate,
      update: { message: updateToApply },
    });
  };

  // here is our UI
  // it is easy to understand their functions when you
  // see them render into our screen
  render() {
    const { data } = this.state;
    return (
      <React.Fragment>
        <div className="teste">
          <h1>19/10/2019</h1>
          <h3>Festa de comemoração do casamento da<br/>Lê e da Lu </h3>
          <div id="historia" className="container">
            <div className="image"></div>
            <div className="text">
              <h6>Oi família e migos,</h6>
              <p> Vamos casar e queremos festejar com vocês, sem roupas especiais, sem cerimônias, só queremos vocês de corpo e alma, comemorando com a gente.<br/>Não temos listinha de presentes, mas essa festa será colaborativa, vamos pedir a confirmação de presença e faremos uma divisão de custos para comidas e bebidas, o espaço é por nossa conta. </p>
            </div>
          </div>
          <div id="confirmar" className="container">
            <div className="image"></div>
            <div className="text">
              <h6>Precisa confirmar ??? SIM!!!</h6>
              <p>Por favor confirmem a sua presença até <strong>02/10</strong> preenchendo os campos abaixo. Assim que vocês confirmarem o seu nome lindo aparecerá na lista de presença no final dessa página.</p>
              <div>
                <input
                  type="text"
                  onChange={(e) => this.setState({ message: e.target.value })}
                  placeholder="SEU NOME COMPLETO"
                  style={{ width: '100%' }}
                />
                <button onClick={() => this.putDataToDB(this.state.message)}>
                  Confirmar presença!!!!!
                </button>
              </div>
            </div>
          </div>
          <div id="onde" className="container">
            <div className="image"></div>
            <div className="text">
              <h6>Onde devo ir ???</h6>
              
              <p>Para Juquitiba, fica uns 76 Km de SP.<br/><a href="https://waze.com/ul?q=Estr.%20Martha%20Maria%20de%20Jesus,%209500">Estrada Martha Maria de Jesus, 9500</a></p>
            </div>
          </div>
          <div id="levar" className="container">
            <div className="image"></div>
            <div className="text">
              <h6>O que devo levar ???</h6>
              <p>Após a confirmação da presença divulgaremos aqui o que você precisará levar. Fica tranquilo que a gente manda o link de novo.</p>
              <p>Pra quem vai dormir:</p>
              <ul className="list">
                <li>Roupa de cama</li>
                <li>Roupa de banho</li>
                <li>Travesseiro</li>
              </ul>
              <p>Como sabem não teremos lugar para todos dormirem :( <br/> 
              </p>
            </div>
          </div>
          <div>
            <h6 className="center">Beijos, amamos vocês</h6>
          </div>
          <div className="foto">
            <img alt="le e lu" src="lelu.jpeg" />
          </div>

          <div id="rsvp" className="container">
            <div className="text">
              <h6>Lista de confirmados</h6>
              <ul className="list">
                {data.length <= 0
                  ? 'Ninguém confirmou =('
                  : data.map((dat) => (
                      <li key={data.message}>
                        {/*<span style={{ color: 'gray' }}> id: </span> {dat.id} <br />*/}
                        {dat.message}
                      </li>
                    ))}
              </ul>
            </div>
          </div>




          <div className="hide">


            <div style={{ padding: '10px' }}>
              <input
                type="text"
                style={{ width: '200px' }}
                onChange={(e) => this.setState({ idToDelete: e.target.value })}
                placeholder="put id of item to delete here"
              />
              <button onClick={() => this.deleteFromDB(this.state.idToDelete)}>
                DELETE
              </button>
            </div>
            <div style={{ padding: '10px' }}>
              <input
                type="text"
                style={{ width: '200px' }}
                onChange={(e) => this.setState({ idToUpdate: e.target.value })}
                placeholder="id of item to update here"
              />
              <input
                type="text"
                style={{ width: '200px' }}
                onChange={(e) => this.setState({ updateToApply: e.target.value })}
                placeholder="put new value of the item here"
              />
              <button
                onClick={() =>
                  this.updateDB(this.state.idToUpdate, this.state.updateToApply)
                }
              >
                UPDATE
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;