import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import Coin from "./pages/Coin";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  App: {
    backgroundColor: "#14161a",
    color: "white",
    minHeight: "100vh",
  },
}));

function App() {
  const classes = useStyles();
  return (
    <BrowserRouter>
      <div className={classes.App}>
        <Header />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/coins/:id" component={Coin} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
