import * as React from 'react';
import { Route } from 'react-router-dom';

import AlertComponent from './components/AlertComponent';
import Home from './components/Home';
import { Layout } from './components/Layout';
import * as RequiredAuthentication from './components/RequiredAuthentication';
import Taxonomy from './components/Taxonomy';
import TaxonomyDetail from './components/TaxonomyDetail';
import UserMenu from './components/UserMenu';

export const routes = (
    <Layout usermenu={UserMenu} alert={AlertComponent}>
        <Route exact={true} path="/" component={Home} />
        <Route exact={true} path="/taxonomy" component={RequiredAuthentication.requireAuthentication(Taxonomy)} />
        <Route path="/taxonomy/:id" component={TaxonomyDetail} />
    </Layout>
);
