import React from 'react';
import {
  Card,
  CardBody,
  Gallery,
  GalleryItem,
  PageSection,
  PageSectionVariants,
  TextContent,
  Text,
} from '@patternfly/react-core';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/patternfly/patternfly.css';

class RequestTechTalk extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <React.Fragment>
        <PageSection variant={PageSectionVariants.light}>
          <TextContent>
            <Text component="h1">Requested Tech Talks</Text>
          </TextContent>
        </PageSection>
        <PageSection>
          <Gallery gutter="md">
            {Array.apply(0, Array(10)).map((x, i) => (
              <GalleryItem key={i}>
                <Card>
                  <CardBody>This is a card</CardBody>
                </Card>
              </GalleryItem>
            ))}
          </Gallery>
        </PageSection>
      </React.Fragment>
    );
  }
}

export default RequestTechTalk;
