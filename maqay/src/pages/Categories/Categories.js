import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./Categories.css";
import Card from "./Card/Card";
import ButtonFilterNav from "./ButtonFilterNav/ButtonFilterNav.jsx";
import getAllPosts from "../../controller/getAllPosts.js";
import getTagsByGroupName from "../../controller/getTagsByGroupName.js";
import getAllTagsNameAndNumber from "../../controller/getAllTagsNameAndNumber.js";

const Categories = () => {
  const [allPosts, setAllPosts] = useState([]);
  /* posts to render: posts ya filtrados */
  const [filteredPosts, setFilteredPosts] = useState([]);
  /* Acá accederemos para conseguir datos de tags */
  const [allTagsNameAndNumber, setAllTagsNameAndNumber] = useState([]);
  const [politicalPartiesTags, setPoliticalPartiesTags] = useState([]);
  const [environmentalTags, setEnvironmentalTags] = useState([]);
  const [navBarTags, setNavBarTags] = useState([]);
  /* Object with Topic's Name and Number */
  /* set category debe ir dentro de la fx que saca las cosas del windowlocation */
  const [mainCategory, setMainCategory] = useState([]);
  const [categorySelected, setCategorySelected] = useState([]);
  const [categorySelectedTags, setCategorySelectedTags] = useState([]);

  /* All posts from Wordpress within category Environmental, with a number set by WP */
  useEffect(() => {
    const categoryAmbiental = 23;
    getAllPosts()
      .then((res) =>
        res.filter((posts) => posts.categories[0] === categoryAmbiental)
      )
      .then((res) => {
        setFilteredPosts(res);
        return setAllPosts(res);
      });
  }, []);

  /* Saves in state: object with Tags' Name and Number */
  useEffect(() => {
    getAllTagsNameAndNumber().then((res) => {
      return setAllTagsNameAndNumber(res);
    });
  }, []);

  /* Returns all tags numbers within tag group name required */
  /*   useEffect(() => {
    getTagsByGroupName("Partidos políticos").then((tags) => {
      return setPoliticalPartiesTags(tags);
    });
  }, []);

  useEffect(() => {
    getTagsByGroupName("Tema ambiental").then((tags) => {
      return setEnvironmentalTags(tags);
    });
  }, []); */

  const { category, subcategory } = useParams();
  useEffect(() => {
    console.log("category / subcategory", category, subcategory);
    setCategorySelected(subcategory);
    setMainCategory(category);
  }, [category, subcategory]);

  useEffect(() => {
    console.log(mainCategory, "mainCategory");

    if (mainCategory.length > 0) {
      getTagsByGroupName(mainCategory).then((tags) => {
        console.log(tags);
        return setCategorySelectedTags(tags);
      });
    }
  }, [mainCategory]);
  /* NAVIGATION BAR Functions 
  DEBE CONVERTIRSE FX PURA CON ARGUMENTO ENVIRONMENTAL O POLITICAL Y VARIAR SEGUN CATEGORY SELECTED*/
  useEffect(() => {
    if (categorySelectedTags) {
      const newArray = allTagsNameAndNumber.filter((tag) => {
        return categorySelectedTags.includes(tag.id);
      });
      setNavBarTags(newArray);
    }
  }, [allTagsNameAndNumber, categorySelectedTags]);

  /* Create property "politicalParties" with only tag number of politicalparties from every post*/
  /*   const tagName = () => {
    // post.tags es el array de tags de cada post
    return allPosts.map((post) => {
      const tags = post.tags;
      const array = politicalPartiesTags.filter((politicalTagNumber) => {
        return tags.includes(politicalTagNumber);
      });
      return (post.politicalParties = array);
    });
  };
  console.log("tagName: ", tagName()); */

  useEffect(() => {
    const newArray = allTagsNameAndNumber.find((tag) => {
      return categorySelected.includes(tag.name);
    });

    if (newArray) {
      const array = allPosts.filter((post) => {
        const tags = post.tags;
        return tags.includes(newArray.id);
      });
      return setFilteredPosts(array);
    }
  }, [allPosts, allTagsNameAndNumber, categorySelected]);
  /* Filters posts by topic selected on NavBar */
  /*   const filterByCategory = (id, tagByCategory) => {
    console.log(tagByCategory, id);
    setCategorySelected(tagByCategory);
    const array = allPosts.filter((post) => {
      const tags = post.tags;
      return tags.includes(parseInt(id));
    });
    return setFilteredPosts(array);
  }; */

  return (
    <div>
      <header className='header-categories'>
        <span>{categorySelected}</span>
       
      </header>
      <main>
        <section className='view-categories'>
          <span className='text-bold'>
            HEMOS IDENTIFICADO{" "}
            <span className='highlighted'>{filteredPosts.length}</span>{" "}
            PROPUESTAS
          </span>
          <p className='main-text'>
            Un cambio climático se define como la variación en el estado del
            sistema climático terrestre, formado por la atmósfera, la
            hidrosfera, la criosfera, la litosfera y la biosfera, que perdura
            durante periodos de tiempo suficientemente largos (décadas o más
            tiempo hasta alcanzar un nuevo equilibrio.
          </p>
          <div className='alerts-guide'> </div>
          <div className='categories-cards-container'>
            {/* Recibe los posts filtrados según el tema seleccionado */}
            {filteredPosts.map((post) => {
              return <Card key={post.id} post={post} />;
            })}
          </div>
        </section>
        
        <div className="wrapper">
        <input type="checkbox" id="btn" hidden/>
        <label for="btn" className="menu-btn">
        <i className="fas fa-bars fa-2x"></i>
        <i className="fas fa-times fa-2x"></i>
        </label>

        <nav className='sidebar'>
          <button
            className='btn-back'
            onClick={() => {
              window.location = "/inicio";
            }}
          >
            <i className='fas fa-chevron-left'></i>REGRESAR
          </button> <br></br>
          <span>Cambiar de tema ambiental</span>
          {navBarTags.map((tag) => {
            return (
              <li><ButtonFilterNav
                key={tag.id}
                tagByTopic={tag}
                path={`/propuestas/${mainCategory}/${tag.name}`}
              /></li>
            );
          })}
        </nav>
        </div>
      </main>
    </div>
  );
};

export default Categories;

/*  useEffect(() => {
    const newArray = allTagsNameAndNumber.filter((tag) => {
      return politicalPartiesTags.includes(tag.number);
    });
    setNavBarTags(newArray);
  }, []); */
