import {Card, CardContent} from "@mui/material";

const defaultRegistry = {
  DestinationCard: () =>     <Card>
      <CardContent sx={{ p: 2, paddingBottom: '16px!important' }}>
          Unsupported card type
      </CardContent>
  </Card>,
};

export default defaultRegistry;
