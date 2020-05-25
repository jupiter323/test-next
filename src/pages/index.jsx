import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Router, { withRouter } from 'next/router'

import '../assets/styles.scss';


const Home = (props) => {
    const [isLoading, setLoading] = useState(false);
    const startLoading = () => setLoading(true);
    const stopLoading = () => setLoading(false);

    useEffect(() => {
        Router.events.on('routeChangeStart', startLoading);
        Router.events.on('routeChangeComplete', stopLoading);

        return () => {
            Router.events.off('routeChangeStart', startLoading);
            Router.events.off('routeChangeComplete', stopLoading);
        }
    }, [])

    const pagginationHandler = (page) => {
        const currentPath = props.router.pathname;
        const currentQuery = { ...props.router.query };
        currentQuery.page = page.selected + 1;

        props.router.push({
            pathname: currentPath,
            query: currentQuery,
        });

    };

    let content = null;
    if (isLoading)
        content = <div>Loading...</div>;
    else {
        content = (
            <ul>
                {props.posts.map(post => {
                    return <li key={post.id}>{post.title}</li>;
                })}
            </ul>
        );
    }

    return (
        <div className="container">
            <h1>Lessons with Pagination in Next.js</h1>
            <div className="posts">
                {content}
            </div>

            <ReactPaginate
                previousLabel={'previous'}
                nextLabel={'next'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                activeClassName={'active'}
                containerClassName={'pagination'}
                subContainerClassName={'pages pagination'}

                initialPage={props.currentPage - 1}
                pageCount={props.pageCount} //page count
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={pagginationHandler}
            />
        </div>
    );
};

Home.getInitialProps = async ({ query }) => {
    const page = query.page || 1;
    const url = `https://gorest.co.in/public-api/posts?_format=json&access-token=cxzNs8fYiyxlk708IHfveKM1z1xxYZw99fYE&page=${page}`
    const config = {
        headers: {
          'X-Dev-User-Id': '53f24b85-94da-4bf2-882b-3ff5ca16d86f',    
        }
      }
      
    const posts = await axios.get(url, null, config);
    return {
        // pageCount: posts.data.pages,
        // currentPage: posts.data.current_page,
        // posts: posts.data.lessons,
        // isLoading: false,
        pageCount: posts.data._meta.pageCount,
        currentPage: posts.data._meta.currentPage,
        posts: posts.data.result,
        isLoading: false,
    };
}


export default withRouter(Home);
