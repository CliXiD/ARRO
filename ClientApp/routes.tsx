import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './components/Home';
import UserMenu from './components/UserMenu';
import Taxonomy from './components/Taxonomy';
import TaxonomyDetail from './components/TaxonomyDetail';
import AlertComponent from './components/AlertComponent';
import * as RequiredAuthentication from './components/RequiredAuthentication';

export const routes = <Layout usermenu={UserMenu} alert={AlertComponent}>
    <Route exact path='/' component={ Home } />
    <Route exact path='/taxonomy' component={ RequiredAuthentication.requireAuthentication(Taxonomy)} />
    <Route path='/taxonomy/:id' component={ TaxonomyDetail } />
</Layout>;
