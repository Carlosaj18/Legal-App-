import React, { useState, useEffect } from "react";
import "../Document/Document.css";
import {
  APICallDocumentsCategoryId,
  APICallDocumentsCheckBox,
} from "../services/mockDocuments";
import {
  APICallDocuments,
  APICallDocumentsCategory,
  APICallDocumentsTitle,
  APICallDocumentsMore,
} from "../services/fireBase";
import DocumentList from "../DocumentList/DocumentList";
import { useParams } from "react-router-dom";
import DocumentCategoryRow from "../DocumentCategory/DocumentCategoryRow";
import Loader from "../Loader/Loader";

function ContainerDocuments(props) {
  const [document, setDocument] = useState([]);
  const [date, setDate] = useState();
  const [loading, setLoading] = useState(true);
  const [ultimo, setUltimo] = useState(null);
  const [term, setTerm] = useState(null);
  const [array, setArray] = useState([]);
  let categoryId = useParams().categoryId;
  let headingContratos = false;
  let headingAcuerdos = false;
  let headingTemplates = false;
  let lastCategory = null;
  let contratos;
  let acuerdos;
  let templates;

  const searchTerm = (termino) => {
    return function (x) {
      return x.title.toLowerCase().includes(termino) || !termino;
    };
  };

  useEffect(() => {
    let hora = new Date().toLocaleTimeString();
    setDate(hora);

    if (props.categoryId) {
      setLoading(true);
      APICallDocumentsCategory(props.categoryId)
        .then((response) => {
          setDocument(response);
          setLoading(false);
        })
        .catch((error) => console.error(error));
    } else if (categoryId) {
      setLoading(true);
      APICallDocumentsCategoryId(categoryId)
        .then((response) => {
          setDocument(response);
          setLoading(false);
        })
        .catch((error) => console.error(error));
    } else if (props.documentTitle) {
      setTerm(props.documentTitle);
      setLoading(true);
      if (array.length > 0) {
        //let documentFound = array.filter(searchTerm(term));
        let documentFound = array.filter((documentArray) => {
          return props.documentTitle.toLowerCase() === " "
            ? documentArray
            : documentArray.title
                .toLowerCase()
                .includes(props.documentTitle.toLowerCase());
        });
        console.log("FILTRADO: ", documentFound);
        setDocument(documentFound);
      } else {
        APICallDocumentsTitle(setArray)
          .then((response) => {
            console.log(array);
            // props.documentTitle
            //setDocument(response);
            setLoading(false);
          })
          .catch((error) => console.error(error));
      }
    } else if (props.moreDocuments || props.moreDocuments === false) {
      // setarlo en false
      props.setMoreDocuments(false);
      setLoading(true);
      APICallDocumentsMore(ultimo, setUltimo)
        .then((response) => {
          setDocument(response);
          setLoading(false);
        })
        .catch((error) => console.error(error));
    } else if (props.searchCheckBox) {
      setLoading(true);
      APICallDocumentsCheckBox(props.searchCheckBox)
        .then((response) => {
          setDocument(response);
          setLoading(false);
        })
        .catch((error) => console.error(error));
    } else if (props.searchCheckBox && props.documentTitle) {
      setLoading(true);
      APICallDocumentsCheckBox(props.searchCheckBox)
        .then((response) => {
          setDocument(response);
          setLoading(false);
        })
        .catch((error) => console.error(error));
    } else {
      setLoading(true);
      APICallDocuments(setUltimo)
        .then((response) => {
          setDocument(response);
          setLoading(false);
        })
        .catch((error) => console.error(error));
    }
  }, [props, categoryId]);

  if (document !== undefined) {
    document.forEach((doc) => {
      if (doc.category !== lastCategory && doc.category === "contratos") {
        headingContratos = true;
      }
      lastCategory = doc.category;
    });

    document.forEach((doc) => {
      if (doc.category !== lastCategory && doc.category === "acuerdos") {
        headingAcuerdos = true;
      }
      lastCategory = doc.category;
    });

    document.forEach((doc) => {
      if (doc.category !== lastCategory && doc.category === "templates") {
        headingTemplates = true;
      }
      lastCategory = doc.category;
    });

    contratos = document.filter((contrato) => {
      return contrato.category === "contratos";
    });
    acuerdos = document.filter((acuerdo) => {
      return acuerdo.category === "acuerdos";
    });
    templates = document.filter((template) => {
      return template.category === "templates";
    });
  }

  return (
    <>
      {" "}
      {headingContratos === true ? (
        <DocumentCategoryRow category="Contratos" />
      ) : null}
      {loading ? (
        <Loader />
      ) : contratos.length > 0 ? (
        <DocumentList latestDocuments={contratos} date={date} />
      ) : null}
      {headingAcuerdos === true ? (
        <DocumentCategoryRow category="Acuerdos" />
      ) : null}
      {loading ? (
        <Loader />
      ) : acuerdos.length > 0 ? (
        <DocumentList latestDocuments={acuerdos} date={date} />
      ) : null}
      {headingTemplates === true ? (
        <DocumentCategoryRow category="Templates" />
      ) : null}
      {loading ? (
        <Loader />
      ) : templates.length > 0 ? (
        <DocumentList latestDocuments={templates} date={date} />
      ) : null}
      {loading ? (
        <Loader />
      ) : document <= 0 ? (
        <div>
          <h1 style={{ textAlign: "center", color: "#234F1E " }}>
            {" "}
            No hay documentos con esos criterios{" "}
          </h1>
        </div>
      ) : null}
    </>
  );
}

export default ContainerDocuments;
