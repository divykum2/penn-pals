import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from "react-router-dom";
import Post from './post';

test('testing navigation', () => {

    const data = {
        "username": "Jana28",
        "post_type": "visual",
        "caption": "Ipsa ducimus soluta architecto.",
        "likes": [
         7
        ],
        "comments": [
         "@(Jana28) Hi"
        ],
        "tags": [],
        "userid": 1,
        "posting": "https://www.wikihow.com/images/thumb/d/d5/Be-Random-Step-8.jpg/aid46489-v4-728px-Be-Random-Step-8.jpg ",
        "id": "1"
       }
    render(<Router><Post loggedInUser={7}
        postData={data}/></Router>);

    expect(screen.getAllByAltText('post')).toHaveAttribute('src', 'https://www.wikihow.com/images/thumb/d/d5/Be-Random-Step-8.jpg/aid46489-v4-728px-Be-Random-Step-8.jpg')
})

test('Post matches snapshot', () => {
    const component = renderer.create(<Router><Post /></Router>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});