export const getRandomIdExcluding = (excludeArr) => {

  if(excludeArr.length == 0){
    // If no exclusions, return a random ID from 1 to 50
    return Math.floor(Math.random() * 50) + 1;
  }  

  const possibleIds = [];
  for (let i = 1; i <= 50; i++) {
    if (!excludeArr.includes(i)) {
      possibleIds.push(i);
    }
  }
  if (possibleIds.length === 0) return null; // no more cards available
  const randomIndex = Math.floor(Math.random() * possibleIds.length);
  return possibleIds[randomIndex];
}

export const generateThreeRandomIds = () => {
  const ids = [];
  while (ids.length < 3) {
    const id = generateRandomId();
    if (id !== null && !ids.includes(id)) {
      ids.push(id);
    }
  }
  return ids;
}

export const generateRandomId = () => {
  const id = Math.floor(Math.random() * 50) + 1; // Generates a random ID between 1 and 50
  return id;
}