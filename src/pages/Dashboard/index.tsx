import { useEffect, useState } from 'react';

import {Header} from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import {ModalAddFood} from '../../components/ModalAddFood';
import {ModalEditFood} from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface Foods {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image: string;
}



export function Dashboard()  {
      const [foods, setFoods] = useState<Foods[]>([])
      const [editingFood, setEditingFood] = useState<Foods>()
      const [modalOpen, setModalOpen] = useState(false)
      const [editModalOpen, setEditModalOpen] = useState(false)


  useEffect(() => {
    async function loadFoods() {
      const response = await api.get('/foods');

    setFoods(response.data)
    }
    loadFoods()
  }, [])

  async function handleAddFood (food: Foods) {
    try {

      const newFood = [...foods]

      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      newFood.push(response.data)

      setFoods(newFood)
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood (food: Foods)  {
    const newFood = [...foods]
    const updateEditingFood = editingFood
    

    try {
      const foodUpdated = await api.put(
        `/foods/${updateEditingFood?.id}`,
        { ...updateEditingFood, ...food },
      );

      const foodsUpdated = newFood.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood (id: number) {
    const newFood = [...foods];

    await api.delete(`/foods/${id}`);

    const foodsFiltered = newFood.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  }

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  }

  const handleEditFood = (food: Foods) => {
    setEditingFood(food);
    setEditModalOpen(true)
  }


    return (
      <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
    );

};

