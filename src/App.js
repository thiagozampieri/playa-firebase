import React, { useState, useEffect, Suspense } from 'react';
import { withStyles } from "@material-ui/core/styles";
import { 
  Container, 
  TextField, 
  Grid, 
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
  GridList,
  GridListTile,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { debounce } from 'lodash';
import { states } from './utils';

const App = ({ firebase, classes }) => {
  const [searchInput, setSearchInput] = useState('');
  const [stateInput, setStateInput] = useState(' ');
  const [playas, setPlayas] = useState([]);

  debounce(setSearchInput, 30000);
  debounce(setStateInput, 30000);

  useEffect(() => {
    async function fetchPlayas() {
      const arrWhere = []; 
      let where_string = ''; 
      if (searchInput !== '') arrWhere.push(`title LIKE '${searchInput}%'`); 
      if (stateInput.trim() !== '') arrWhere.push(`state = '${stateInput}'`); 
      if (arrWhere.length > 0) where_string = `WHERE ${arrWhere.join(' AND ')}`;

      const query = `SELECT * FROM playas ${where_string}`;
      await firebase.fireSQL().query(query)
      .then(snapshot => {
        const playas = [];
        snapshot.forEach(doc => playas.push(doc));
        setPlayas(playas);
      }); 
    }

    fetchPlayas();
  }, [searchInput, stateInput]); // eslint-disable-line

  return (
    <Suspense fallback={<Skeleton variant="rect" width={210} height={118} />}>
      <Container>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          style={{ padding: '20px'}}
        >
          <FormControl fullWidth style={{ flexDirection: 'row' }}>
            <InputLabel id="simple-select-label">Escolha um estado</InputLabel>
            <Select
              labelId="simple-select-label"
              value={stateInput}
              onChange={(e) => setStateInput(e.target.value)} 
              style={{ width: '30%' }}
              variant="filled"
              displayEmpty
            >
              <MenuItem value=" ">Todos</MenuItem>
              {states.map(item => 
                (<MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>)
              )}
            </Select>
            <TextField 
              type="search"
              onChange={(e) => setSearchInput(e.target.value)} 
              label="Digite a praia desejada aqui"
              value={searchInput} 
              variant="filled"
              style={{ width: '70%' }}
            />
          </FormControl>

          <GridList cellHeight={700} cols={2} spacing={10}>
            {
              playas.map(row => (
                <GridListTile key={row.title} cols={1}>
                  <Card className={classes.card}>
                    <CardHeader
                      title={row.title}
                      subheader={row.source}
                    />
                    <CardMedia
                      className={classes.media}
                      image={row.image_url}
                      title={row.title}
                    />
                    <CardContent>
                      <Typography variant="body2" color="textSecondary" component="p">
                      {row.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </GridListTile>
              ))
            }
          </GridList>
        </Grid>
      </Container>
    </Suspense>
  )
};

const styles = () => ({
  card: {
    maxWidth: '100%',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
});

export default withStyles(styles)(App)