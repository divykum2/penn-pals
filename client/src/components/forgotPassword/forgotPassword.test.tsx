/**
* @jest-environment jsdom
*/
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import {BrowserRouter as Router} from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import ForgotPassword from './forgotPassword';


test('renders page', async() => {
  render(<Router><ForgotPassword /></Router>);

  expect(screen.getByText('Password Recovery')).toBeInTheDocument();
  expect(screen.getByText('Email Address or Username')).toBeInTheDocument();
  expect(screen.getByText('Submit')).toBeInTheDocument();

});

test('testing navigation', () => {
    render(<Router><ForgotPassword /></Router>);

  const button = screen.getByRole('button');
  fireEvent.click(button);
})

test('renders app logo', () => {
    render(<Router><ForgotPassword/></Router>);
    const image = screen.getByAltText('logo');
    expect(image).toHaveAttribute('src', 'logo.png');
})

test('Activity feed matches snapshot', () => {
    const component = renderer.create(<Router><ForgotPassword /></Router>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});