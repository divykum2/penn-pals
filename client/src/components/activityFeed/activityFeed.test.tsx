import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from "react-router-dom";
import ActivityFeed from './activityFeed';

test('renders activity feed', async() => {
  render(<Router><ActivityFeed /></Router>);

  expect(screen.getByText('Notifications')).toBeInTheDocument();
  expect(screen.getByText('Profile')).toBeInTheDocument();
  expect(screen.getByText('Logout')).toBeInTheDocument();

});

test('testing navigation', () => {
  render(<Router><ActivityFeed /></Router>);

  const button = screen.getByRole('button', {name: "Profile"});
  fireEvent.click(button);

  // expect(screen.getByText('Suggested Users')).toBeInTheDocument();

})

test('renders app logo', () => {
    render(<Router><ActivityFeed/></Router>);

    const image = screen.getByAltText('logo');
    expect(image).toHaveAttribute('src', 'logo.png');
})

test('Activity feed matches snapshot', () => {
    const component = renderer.create(<Router><ActivityFeed /></Router>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
