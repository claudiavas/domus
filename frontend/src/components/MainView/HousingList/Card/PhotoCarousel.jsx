import { Container } from '@mui/system';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export const PhotoCarousel = ({ showThumbs, images, extraSlide }) => {

  return (
    <Container style={{ padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
    <Carousel showThumbs={showThumbs}>
      {[
        ...images.map((image, index) => (
          <span key={index}>
            <img src={image} alt="housing images" style={{objectFit: 'contain', width: '100%', height: '100%'}} />
          </span>
        )),
        ...(extraSlide ? [<span key="extra" style={{ display: 'block', height: '100%' }}>{extraSlide}</span>] : []),
      ]}
      </Carousel>
    </Container>
  )
};
