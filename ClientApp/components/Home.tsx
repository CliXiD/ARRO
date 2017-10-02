import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

export default class Home extends React.Component<RouteComponentProps<{}>, {}> {
    public render() {
        return (
            <div>
                <h1>Hello, world!</h1>
                <p>Welcome to your new single-page application, built with:</p>
                <ul>
                    <li><a href="https://get.asp.net/">ASP.NET Core</a> and <a href="https://msdn.microsoft.com/en-us/library/67ef8sbd.aspx">C#</a> for cross-platform server-side code</li>
                    <li><a href="https://github.com/aspnet/EntityFrameworkCore">EF Core 2.0</a> for model</li>
                    <li><a href="https://github.com/openiddict/openiddict-core">OpenIdDict</a> for Authentication &amp; Authorization</li>
                    <li><a href="https://facebook.github.io/react/">React</a>, <a href="http://redux.js.org">Redux</a>, and <a href="http://www.typescriptlang.org/">TypeScript</a> for client-side code</li>
                    <li><a href="https://github.com/erikras/redux-form">Redux-Form</a> for form controls</li>
                    <li><a href="https://github.com/reactjs/react-transition-group">React Transition Group</a> for animation</li>
                    <li><a href="https://webpack.github.io/">Webpack</a> for building and bundling client-side resources</li>
                    <li><a href="http://getbootstrap.com/">Bootstrap</a> for layout and styling</li>
                </ul>
            </div>
        );
    }
}
