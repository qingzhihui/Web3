import React, {Component} from "react";
import {
    HashRouter, Route, Switch, Redirect
} from "react-router-dom";
import App from "../App";
import Admin from "../view/Admin";
import BesHome from "../view/BesHome";
import BesDemo from "../view/BesDemo";

// class indexRouter extends Component {
//   render() {
//     return (
//       <Router>
//         <Switch>
//           <Route path="/Home" component={BesHome} />
//           <Route path="/Demo" component={BesDemo} />
//           <Redirect from="/" to="/Home" />
//         </Switch>
//       </Router>
//     );
//   }
// }
export default function Router() {
    return (
        <HashRouter>
            <App>
                <Route
                    path="/"
                    render={() => (
                        <Admin>
                            <Switch>
                                <Route path="/Home" component={BesHome}/>
                                <Route path="/Demo" component={BesDemo}/>
                                <Redirect from="/" to="/Home"/>
                            </Switch>
                        </Admin>
                    )}
                />
            </App>
        </HashRouter>
    );
}

