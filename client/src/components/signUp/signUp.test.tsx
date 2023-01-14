 /**
* @jest-environment jsdom
*/
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import {BrowserRouter as Router} from 'react-router-dom';
import SignUp from './signUp';
import LoginPage from '../loginPage/loginPage';

test('renders page', async() => {
  render(<Router><SignUp /></Router>);

  expect(screen.getByText('Sign Up')).toBeInTheDocument();
  expect(screen.getByText('Username')).toBeInTheDocument();
  expect(screen.getByText('First Name')).toBeInTheDocument();
  expect(screen.getByText('Last Name')).toBeInTheDocument();
  expect(screen.getByText('Email Address')).toBeInTheDocument();
  expect(screen.getByText('Password')).toBeInTheDocument();
});

test('testing navigation', () => {
    render(<Router><SignUp /></Router>);

  const button = screen.getByRole('button', {name: "Sign Up"});
  fireEvent.click(button);
  render(<Router><LoginPage/></Router>)
  expect(screen.getByText("Sign in")).toBeInTheDocument()
  
})

test('renders app logo', () => {
    render(<Router><SignUp/></Router>);
    const image = screen.getByAltText('logo');
    expect(image).toHaveAttribute('src', 'logo.png');
})

test('Activity feed matches snapshot', () => {
    const component = renderer.create(<Router><SignUp/></Router>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});