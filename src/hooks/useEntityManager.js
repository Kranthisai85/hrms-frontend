import { useState } from "react";

export function useEntityManager() {
  const [entities, setEntities] = useState([]);

  const addEntity = (entity) => {
    setEntities([...entities, { ...entity, id: Date.now() }]);
  };

  const updateEntity = (id, updatedEntity) => {
    setEntities(
      entities.map((entity) =>
        entity.id === id ? { ...entity, ...updatedEntity } : entity
      )
    );
  };

  const deleteEntity = (id) => {
    setEntities(entities.filter((entity) => entity.id !== id));
  };

  return { entities, addEntity, updateEntity, deleteEntity };
}
