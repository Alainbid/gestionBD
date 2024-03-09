import "./styles/App.scss";
import { db } from "./FirebaseFirestore";
import {
  collection,
  getDocs,
  deleteDoc,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";

function App() {
  //pour supprimer certains documents d'une collection
  const codesCollectionRef = collection(db, "cfbjournal");
  const [docTrouvés, setDocTrouvés] = useState(0);
  const [leTotalDebut, setLetotalDebut] = useState(0);
  const [texte, setTexte] = useState("");
  const [nombre, setNombre] = useState(0);
  const [champ, setChamp] = useState("");
  const[ texteFin,setTexteFin] = useState("");

  const getDocumentCount = async () => {
    const leQuery = query(codesCollectionRef);
    try {
      const querySnapshot = await getDocs(leQuery);
      setLetotalDebut(querySnapshot.size);
    } catch (error) {
      console.error("Error getting document count: ", error);
    }
  };

  useEffect(() => {
    if (leTotalDebut === 0) {
      getDocumentCount();
    }
  }, []);

  const handelText = (e) => {
    let letexte = e.target.value;
    if (!isNaN(letexte)) {
      console.log("nombre");
      setTexte(parseFloat(letexte));
    } else if (letexte.toLowerCase() === "true") {
      console.log("boolean"); // If it's a boolean
      letexte = true;
      setTexte(letexte);
    } else if (letexte.toLowerCase() === "false") {
      letexte = false;
      setTexte(letexte);
    } else {
      setTexte(letexte.toString());
      console.log("Input Value:", texte);
    }
  };

  const chercher = async () => {
    if (champ === "" || texte === "") {
      return;
    }
    if (texte !== "") {
      var lequery = query(codesCollectionRef, where(champ, "==", texte));
    }
    try {
      const querySnapshot = await getDocs(lequery);
      setDocTrouvés(querySnapshot.size);
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };

  const modifChamp = (e) => {
    setChamp(e.target.value);
    // console.log("champ", champ);
  };

  useEffect(() => {
    chercher();
  }, [texte, nombre, champ]);


  const handelDelete = async () => {
    const batch = writeBatch(db);
    const lequery = query(codesCollectionRef, where(champ, "==", texte));
    try {
      const querySnapshot = getDocs(lequery);
      querySnapshot.then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // batch.delete(doc.ref);
        });
        batch.commit().then(() => {
          console.log("Documents successfully deleted!");
        });
      });
    } catch (error) {
      console.error("Error deleting documents: ", error);
    }
    getDocumentAprès();
  };


  const getDocumentAprès = async () => {
    try {
      var x = await getDocs(query(codesCollectionRef));
      // Now 'remainingDocuments' holds the data of the remaining documents
      console.log("Nbre Documents après delete:", x.size);
      var colorStyle = { color: 'red' };  // Define the color style object
      var texteFin = (
        <h2 style={colorStyle}>
          nombre de documents après suppression {x.size}
        </h2>
      );
      // Set the state to trigger a re-render
      setTexteFin(texteFin);
    } catch (error) {
      console.error("Error getting document count: ", error);
    }
  };
  

  return (
    <div className="App">
      <h1 style={{ color: "black" }}>
        Suppression de certains documents d'une collection{" "}
      </h1>

      <h2 style={{ color: "black" }}>
        nombre total de documents dans la collection {leTotalDebut}
      </h2>

      <form className="form">
        <label>
          Rechercher sur
          <input
            id="leChamp"
            type="text"
            value={champ}
            onChange={(event) => modifChamp(event)}
          />
        </label>
        <label>
          Texte à supprimer
          <input
            id="letexte"
            type="text"
            //value={texte}
            onChange={(event) => handelText(event)}
            defaultValue={texte}
          />
        </label>
      </form>

      <h4 style={{ color: "green" }}>
        nombre de documents sélectionnés selon critères ={" "}
        <span style={{ display: "inline-block", fontSize: 28 }}>
          {docTrouvés}
        </span>
      </h4>

      <button onClick={handelDelete}>Supprimer</button>
      <div  id="après">{texteFin}</div>

    </div>
  );
}

export default App;
