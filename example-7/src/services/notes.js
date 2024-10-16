import axios from "axios";
// this app is getting the json from the backend project where we use cors if we want to run this app we first have to enable the backend server
const baseUrl = "/api/notes";

async function getAll() {
  const request = axios.get(baseUrl);
  const nonExisting = {
    id: 1000,
    content: "This is a note not saved on the server",
    important: true,
  };
  return await request.then((response) => {
    return response.data.concat(nonExisting);
  });
}

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request
    .then((response) => response.data)
    .catch((error) => {
      console.log("Error in axious.Put", error);
    });
};

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then((response) => response.data);
};

export default {
  getAll,
  create,
  update,
};
