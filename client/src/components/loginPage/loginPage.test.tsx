import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import {BrowserRouter as Router} from 'react-router-dom';
import LoginPage from './loginPage';
import '@testing-library/jest-dom/extend-expect';

test('renders page', async() => {
  render(<Router><LoginPage /></Router>);

  expect(screen.getByText('Sign In')).toBeInTheDocument();
  expect(screen.getByText('Username or Email')).toBeInTheDocument();
  expect(screen.getByText('Password')).toBeInTheDocument();
});

test('testing navigation', () => {
  render(<Router><LoginPage /></Router>);

  const button = screen.getByRole('button', {name: "Sign In"});
  fireEvent.click(button);
})

test('renders app logo', () => {
    render(<Router><LoginPage/></Router>);
    const image = screen.getByAltText('logo');
    expect(image).toHaveAttribute('src', 'logo.png');
})

test('Activity feed matches snapshot', () => {
    const component = renderer.create(<Router><LoginPage /></Router>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});