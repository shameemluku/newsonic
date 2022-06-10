import React from 'react'
import {Container} from 'react-bootstrap'
import ScrollContainer from 'react-indiana-drag-scroll'
import Slide from './Slide'
import "./Slider.css"

export default function Slider({data}) {

  return (
    // <Container>
    //     <div className="slider-body mt-3 d-flex">
    //       <Slide data={data[3]}/>
    //       <Slide data={data[4]}/>
    //       <Slide data={data[5]}/>
    //       <Slide data={data[6]}/>
    //       <Slide data={data[7]}/>
    //     </div>
    // </Container>

    <Container>
        <ScrollContainer className="scroll-container slider-body mt-3 d-flex">
          <Slide data={data[3]}/>
          <Slide data={data[4]}/>
          <Slide data={data[5]}/>
          <Slide data={data[6]}/>
          <Slide data={data[7]}/>
        </ScrollContainer>
    </Container>


  )
}
