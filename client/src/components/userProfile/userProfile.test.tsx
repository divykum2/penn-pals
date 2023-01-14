import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import {BrowserRouter as Router} from 'react-router-dom';
import UserProfile from "./userProfile";
import PostCreation from '../postCreation/postCreation';

test("renders navigation bar", async() => {
    render(<Router><UserProfile /></Router>);
  
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Feed')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  
});

test('renders app logo', () => {
    render(<Router><UserProfile /></Router>);

    const image = screen.getByAltText('logo');
    expect(image).toHaveAttribute('src', 'logo.png');
})

test('testing navigation', () => {
    render(<Router><UserProfile /></Router>);

    const button = screen.getByRole('button', {name: "Feed"});
    fireEvent.click(button);
    expect(screen.getByText('Logout')).toBeInTheDocument();

    const button1 = screen.getByRole('button', {name: "Add Post"});
    fireEvent.click(button1);
    render(<Router><PostCreation/></Router>)

})

test('testing profile information', () => {
    render(<Router><UserProfile /></Router>);

    expect(screen.getByText('Followers')).toBeInTheDocument();
    expect(screen.getByText('Following')).toBeInTheDocument();
})

test("check presence of buttons button", () => {

    render(<Router><UserProfile /></Router>);

    expect(screen.getByText('Add Post')).toBeInTheDocument();
    expect(screen.getByText('Add Status')).toBeInTheDocument();

})


test('User Profile matches snapshot', () => {
    const component = renderer.create(<Router><UserProfile /></Router>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

