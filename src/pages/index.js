/**
 * Ultra-ELE homepage
 * 
 * @2019/02/02
 */
import React, { useState, useEffect }  from 'react'

import { graphql } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'
import Gallery from '../components/gallery'
import Tutorials, { TutorialList } from '../components/tutorials'
import Swiper from '../components/swiper'
import useMedia480 from '../hooks/useMedia480'

class IndexPage extends React.Component { 

  // const { catedocs, tutorials } = data
  // responsive layout by media query @2019/05/28
  // const mobile = useMedia480()
  
  constructor(props) {
    super(props)
  
    this.state = {
       ismobile: false
    }
  }

  resizeHandler = mq => {
    this.setState({ismobile: mq.matches})
  }

  componentWillMount(){
    const con = "(max-width: 480px)"
    const mq = window.matchMedia(con)
    mq.addListener(this.resizeHandler)
    this.setState({ismobile: mq.matches})
  }

  // componentDidMount(){
    
  // }
  
  render(){

    const { catedocs, tutorials } = this.props.data

    if(this.state.ismobile){
      return (
        <Layout>
          <SEO title="Home" keywords={[`gatsby`, `elms`, `elearning`]} />
          <Swiper data={catedocs} />
          <TutorialList data={tutorials} />
        </Layout>
      )
    }else{
      return (
        <Layout>
          <SEO title="Home" keywords={[`gatsby`, `elms`, `elearning`]} />
          <h3 style={{paddingTop: `1.45rem`}}>Topics and Skills</h3>
          <Gallery data={catedocs} />
          <h3>Start your journey</h3>
          <Tutorials data={tutorials} />
        </Layout>
      )
    }
  
  }

}

export default IndexPage



export const IndexQuery = graphql`
  query IndexQuery {

    # query all the index.md in each category @2019/03/03
    catedocs: allMarkdownRemark(
      filter: {
        fields: { slug: {regex: "/\/category\/[\\\\w-]+\/$/"} }
      },
      sort: { fields: [frontmatter___date], order: DESC }
    ){
      edges {
        node {
          fields {slug}
          frontmatter {
            category
            date
            cover {
              childImageSharp {
                fluid(maxWidth: 345, maxHeight: 328) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
            ishead
          }
        }
      }
    }

    # query latest tutorials files
    tutorials: allMarkdownRemark(
      limit: 20
      filter: {frontmatter: {title: {ne: ""}, tutorial: {ne: null}}},
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              cover {
                childImageSharp {
                  fluid(maxWidth: 250, maxHeight: 100){
                    ...GatsbyImageSharpFluid
                  }
                }
              }
              tutorial
              title
              date(formatString: "MMMM DD, YYYY")
            }
          }
        }
      }
    # query content/category/categories.md @2019/02/22
    # categories: markdownRemark(fields: { slug: { eq: "/categories/" } }) {
    #   frontmatter {
    #     categories {
    #       cover {
    #         childImageSharp {
    #           fluid(maxWidth: 345){
    #             ...GatsbyImageSharpFluid
    #           }
    #         }
    #       }
    #       path
    #       name
    #     }
    #   }
    # }
    # this is obsolete @2019/02/20
    # categories: file(relativePath: { regex: "/index-gallery/" }) {
    #   childDataYaml {
    #     categories {
    #       name
    #       path
    #       cover
    #     }
    #   }
    # }

  }
`
