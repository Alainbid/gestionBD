import "./styles/App.scss";
import { db } from "./FirebaseFirestore";
import {
  collection,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Alerte from "./components/Alerter";

function App() {
  //pour supprimer certains documents d'une collection

  const [docTrouvés, setDocTrouvés] = useState(0);
  const [leTotalDebut, setLetotalDebut] = useState(0);
  const [texte, setTexte] = useState("");
  const [champ, setChamp] = useState("");
  const [texteFin, setTexteFin] = useState("");
  const [labd, setLabd] = useState("journaltest");
  const codesCollectionRef = collection(db, labd);
  const [fieldNames, setFieldNames] = useState([]);
  const [showAlerte, setShowAlerte] = useState(false);
  const [userConfirmation, setUserConfirmation] = useState(false);
  const listeChamps = useMemo(() => [], []);
  // mémorise que "() =>" est une fonction qui initialise un tableau "[]"   qui est vide ", []"

  //recherche du nombre de documents dans la collection
  const getDocumentCount = useCallback(async () => {
    const leQuery = query(codesCollectionRef);
    try {
      const querySnapshot = await getDocs(leQuery);
      setLetotalDebut(querySnapshot.size);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        Object.keys(data).forEach((fieldName) => {
          if (!listeChamps.includes(fieldName)) {
            listeChamps.push(fieldName);
          }        });// liste des champs de la collection
      });
      setFieldNames(listeChamps);// liste des champs de la collection
    } catch (error) {
      console.error("Erreur du query  getDocumentCount() ", error);
    }
  }, [codesCollectionRef, setLetotalDebut,listeChamps]);


  useEffect(() => {
    getDocumentCount();
  }, [labd,getDocumentCount,listeChamps]);

  //vérification des différents types de données
  const handelText = (e) => {
    let letexte = e.target.value;
    if (!isNaN(letexte)) {
      // alors c'est un nombre
      console.log("nombre");
      setTexte(parseFloat(letexte));
    } else if (letexte.toLowerCase() === "true") {
      console.log("boolean"); //  it's a boolean
      letexte = true;
      setTexte(letexte);
    } else if (letexte.toLowerCase() === "false") {
      letexte = false;
      setTexte(letexte);
    } else {
      // sinon c'est un texte
      setTexte(letexte.toString());
      console.log("Input Value:", texte);
    }
  };

  // recherche des documents selon critères
  const chercher = useCallback( async () => {
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
      console.error("Erreur du query chercher() documents: ", error);
    };
  },[champ, texte, codesCollectionRef]);

  
  //recherche du nombre de documents dans la collection après suppression
  const getDocumentAprès = useCallback (async () => {
    try {
      var x = await getDocs(query(codesCollectionRef));
      // Now 'remainingDocuments' holds the data of the remaining documents
      console.log("Nombre après delete", x.size);
      var colorStyle = { color: "red" }; // Define the color style object
      var texteFin = (
        <h2 style={colorStyle}>
          nombre de documents après suppression {x.size}
        </h2>
      );
      // Set the state to trigger a re-render
      setTexteFin(texteFin);
    } catch (error) {
      console.error("Erreur du query getDocumentsAprès() après delete: ", error);
    }
    setTimeout(() => {
      window.location.reload();
    }, 2000);
    
  }, [codesCollectionRef, setTexteFin]);

    //suppression des documents
    const  handelDelete =useCallback ( async () => {
      if(docTrouvés === 0){return};
      setShowAlerte(true);
      if (userConfirmation) {
        const batch = writeBatch(db);
        const lequery = query(codesCollectionRef, where(champ, "==", texte));
        try {
          const querySnapshot = getDocs(lequery);
          querySnapshot.then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
               batch.delete(doc.ref);
            });
            batch.commit().then(() => {
              console.log("Documents successfully deleted!");
               getDocumentAprès();
            });
           
          });
        } catch (error) {
          console.error("Erreur du query handelDelete()  deleting documents: ", error);
        }
          setShowAlerte(false);
      };
    } , [userConfirmation, champ, texte, codesCollectionRef, docTrouvés, getDocumentAprès]);


  //recherche des documents selon quel champ
  const modifChamp = (e) => {
    setChamp(e.target.value);
    // console.log("champ", champ);
  };

  const modifChoixBD = (e) => {
    setLabd(e.target.value);
    // console.log("labd", labd);
  };

  const handleConfirm = () => {
    setUserConfirmation(true);
    setShowAlerte(false);
  };

  const handleCancel = () => {
    setUserConfirmation(false);
    setShowAlerte(false);
  };


  useEffect(() => {
    if (userConfirmation) {
      handelDelete();
    }
  }, [userConfirmation, handelDelete]);

  useEffect(() => {
    chercher();
  }, [texte, champ, labd, chercher]);


  return (
    <div className="App">
      <h1 style={{ color: "black" }}>
        Suppression de certains documents d'une collection{" "}
      </h1>

      <div className="App"></div>

      <h2 style={{ color: "black" }}>
        nombre total de documents dans la collection {leTotalDebut}
      </h2>

      <form className="form">
        <label>
          Rechercher sur
          <input
            id="laBD"
            type="text"
            value={labd}
            onChange={(event) => modifChoixBD(event)}
          />
        </label>
        <label>
          Rechercher sur
          <select value={champ} onChange={modifChamp}>
            <option value="" disabled>
              ?
            </option>
            {fieldNames.map((fieldName, index) => (
              <option key={index} value={fieldName}>
                {fieldName}
              </option>
            ))}
          </select>
        </label>
        <label>
          Texte à supprimer
          <input
            id="letexte"
            type="text"
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
      {docTrouvés !== 0 && (
          <button onClick={handelDelete}>Supprimer</button>
      )}
      <div id="après">{texteFin}</div>
      <div>{showAlerte && <Alerte onConfirm={handleConfirm} onCancel={handleCancel} />}</div>
    </div>
  );
}

export default App;
