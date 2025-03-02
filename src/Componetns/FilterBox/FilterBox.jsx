import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CategoryFilter from "../CategoryFilter/CategoryFilter";
import { ProblemContext } from "../../Context/ProblemContext/ProblemContext";
import { FiltersContext } from "../../Context/FiltersContext/FiltersContext";
import originalProblems from "../../JsonFiles/Problems.json";
import styles from "./FilterBox.module.css";

function FilterBox() {
  const { filteredProblems, setFilteredProblems } =
    React.useContext(ProblemContext);
  const [tempProblems, setTempProblems] = useState(originalProblems);
  // prettier-ignore
  const {
    nameFiltred, setNameFiltred, minLevel, setMinLevel, 
    maxLevel, setMaxLevel, category, setCategory, tags, setTags
  } = React.useContext(FiltersContext);
  const navigate = useNavigate();

  //Si en algun momento el boton go no funciona, utiliza el y quieres arreglarlo contrareloj,
  //  en el discord de edgar esta fijado un useEffect

  const handleApplyFilters = () => {
    setTempProblems(() => {
      //prettier-ignore
      return originalProblems.filter((element) =>
          element.title.toLowerCase().includes(nameFiltred.toLowerCase()) &&
          (minLevel !== -1 ? element.problemLevel >= minLevel : true) &&
          (maxLevel !== -1 ? element.problemLevel <= maxLevel : true) &&
          (category.length > 0 ? category.includes(element.majorTopic) : true) &&
          (tags.length > 0 ? element.tags.some((tag)=> tags.includes(tag)): true)
      );
    });
  };

  const handleRandomizer = () => {
    const randomProblem =
      filteredProblems[Math.floor(Math.random() * tempProblems.length)];
    if (randomProblem === undefined) {
      alert("No problems found with the current filters");
      return;
    }
    navigate("/Problem", { state: { currentProblem: randomProblem } });
  };

  const handleClearAllFilters = () => {
    setNameFiltred("");
    setMinLevel(-1);
    setMaxLevel(-1);
    setCategory([]);
    setTags([]);
    setTempProblems([...originalProblems]);
  };

  useEffect(() => {
    if (category.length === 0) {
      setTags([]);
    }
  }, [category]);

  useEffect(() => {
    setFilteredProblems([...tempProblems]);
  }, [tempProblems]);

  return (
    <section className={styles.filterBox}>
      <form id="filterForm" className={styles.filterForm}>
        <input
          key={"filter by name"}
          className={styles.inputText}
          id="filter by name"
          type="text"
          value={nameFiltred}
          onChange={(event) => setNameFiltred(event.target.value)}
          placeholder={"Search problem..."}
        />
        <div>
          <label htmlFor="filter by min level"> Min lvl:</label>
          <input
            key={"filter by min level"}
            className={styles.inputText}
            id="filter by min level"
            type="text"
            value={minLevel === -1 ? "" : minLevel} //para que no se vea el 1 por defecto
            onChange={(event) => setMinLevel(Number(event.target.value))}
            placeholder="0"
          />
          <label htmlFor="filter by max level"> Max lvl:</label>
          <input
            key={"filter by max level"}
            className={styles.inputText}
            id="filter by max level"
            type="text"
            value={maxLevel === -1 ? "" : maxLevel} //para que no se vea el 12 por defecto
            onChange={(event) => setMaxLevel(Number(event.target.value))}
            placeholder="12"
          />
        </div>
        <CategoryFilter
          category={category}
          setCategory={setCategory}
          setTempProblems={setTempProblems}
          tags={tags}
          setTags={setTags}
          className={styles.categoryFilter}
        />

        <button
          className={styles.button}
          type="button"
          onClick={handleApplyFilters}
        >
          Apply Filters
        </button>
        <button
          className={styles.button}
          type="button"
          onClick={handleRandomizer}
        >
          Randomizer
        </button>
        <button type="button" onClick={handleClearAllFilters}>
          Clear All
        </button>
      </form>
    </section>
  );
}

export default FilterBox;
