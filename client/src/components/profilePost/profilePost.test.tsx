import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import {BrowserRouter as Router} from 'react-router-dom';
import ProfilePost from './profilePost';

test('render post 1', () => {
    render(<Router><ProfilePost postid={1} /></Router>);

    expect(screen.getByText("Ipsa ducimus soluta architecto.")).toBeInTheDocument();
})

test('Activity feed matches snapshot', () => {
    const component = renderer.create(<Router><ProfilePost/></Router>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});