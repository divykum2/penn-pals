import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from "react-router-dom";
import SuggestedUser from './suggestedUser';

test('render page', () => {
    render(<Router><SuggestedUser /></Router>);

    expect(screen.getByText("Suggested Users")).toBeInTheDocument();
})

test('testing navigation', () => {
    render(<Router><SuggestedUser /></Router>);

    const temp = screen.getByLabelText('search')
    expect(temp).toBeInTheDocument()

})

test('Post matches snapshot', () => {
    const component = renderer.create(<Router><SuggestedUser /></Router>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});