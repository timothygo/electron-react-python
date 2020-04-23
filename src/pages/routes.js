import Home from "./Home";

const routes = [];
const addRoute = (path, exact, component) => {
  routes.push({ path, exact, component });
};

addRoute("/", true, Home);

export default routes;
