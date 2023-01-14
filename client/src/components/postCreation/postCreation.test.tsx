import React from 'react';
import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import {BrowserRouter as Router} from 'react-router-dom';
import PostCreation from './postCreation';

test("renders user's profile", async() => {
    render(<Router><PostCreation /></Router>);
  
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Feed')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  
});

test('renders app logo', () => {
    render(<Router><PostCreation /></Router>);

    const image = screen.getByAltText('logo');
    expect(image).toHaveAttribute('src', 'logo.png');
})

// test('button test', () => {
//     render(<Router><PostCreation /></Router>);
//     const button = screen.getAllByRole('button', {'name': 'Public | Viewable by All Users'})
//     expect(button).toBeInTheDocument();
// })

test('Post upload fields', () => {
    render(<Router><PostCreation /></Router>);
    expect(screen.getByText('Caption')).toBeInTheDocument();
    expect(screen.getByText('Visibility')).toBeInTheDocument();
    expect(screen.getByText('Tags')).toBeInTheDocument();
})

test('Post matches snapshot', () => {
    const component = renderer.create(<Router><PostCreation /></Router>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});