import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import {BrowserRouter as Router} from 'react-router-dom';
import OtherUserProfile from './otherUserProfile';

test("renders navigation bar", async() => {
    render(<Router><OtherUserProfile /></Router>);
  
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Feed')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  
});

test("set state", async() => {
    render(<Router><OtherUserProfile /></Router>);
  
});

test('renders app logo', () => {
    render(<Router><OtherUserProfile /></Router>);

    const image = screen.getByAltText('logo');
    expect(image).toHaveAttribute('src', 'logo.png');
})

test('testing navigation', () => {
    render(<Router><OtherUserProfile /></Router>);

    const button = screen.getByRole('button', {name: "Feed"});
    fireEvent.click(button);
    expect(screen.getByText('Logout')).toBeInTheDocument();
})

test('testing profile information', () => {
    render(<Router><OtherUserProfile /></Router>);

    expect(screen.getByText('Followers')).toBeInTheDocument();
    expect(screen.getByText('Following')).toBeInTheDocument();
})

test('User Profile matches snapshot', () => {
    const component = renderer.create(<Router><OtherUserProfile /></Router>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

