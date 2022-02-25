import {
  Container,
  createTheme,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
  Typography,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { makeStyles } from "@material-ui/styles";
import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { CoinList } from "../config/api";
import { CryptoState } from "../CryptoContext";

const useStyles = makeStyles(() => ({
  row: {
    backgroundColor: '#16171a',
    cursor: 'pointer',
    fontFamily: 'Montserrat',
    '&:hover': {
      backgroundColor: '#131111'
    }
  },
  pagination: {
    '& .MuiPaginationItem-root': {
      color: 'gold'
    }
  }
}))

const numberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const CoinsTable = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1)
  const { currency, currencySymbol } = CryptoState();
  const history = useHistory()
  const classes = useStyles()

  const fetchCoins = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(CoinList(currency));
      setCoins(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });

  const handleSearchChange = () => {
    return coins.filter(coin => coin.name.toLowerCase().includes(search) || coin.symbol.toLowerCase().includes(search))
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Container style={{ textAlign: "center" }}>
        <Typography
          variant="h4"
          style={{ margin: 18, fontFamily: "Montserrat" }}
        >
          Cryptocurrency Prices by Market Cap
        </Typography>

        <TextField
          label="Search for a Crypto Currency"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            marginBottom: 20,
            width: "100%",
          }}
        />

        <TableContainer>
          {loading ? (
            <LinearProgress style={{ backgroundColor: "gold" }} />
          ) : (
            <Table>
              <TableHead style={{ backgroundColor: "#eebc1d" }}>
                <TableRow>
                  {["Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                    <TableCell
                      style={{
                        color: "black",
                        fontWeight: "700",
                        fontFamily: "Montserrat",
                      }}
                      key={head}
                      align={head === "Coin" ? "inherit" : "right"}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {
                  handleSearchChange().slice((page-1)*10, (page-1)*10 + 10).map(row => {
                    const isProfit = row.price_change_percentage_24h >= 0
                    return (
                      <TableRow
                        onClick={() => history.push(`/coins/${row.id}`)}
                        className={classes.row}
                        key={row.name}
                      >
                        <TableCell
                          component={'th'}
                          scope={'row'}
                          style={{
                            display: 'flex',
                            gap: 15
                          }}
                        >
                          <img 
                            src={row.image} 
                            alt={row.name}
                            height='50'
                            style={{marginBottom: 10}}
                          />

                          <div style={{display: 'flex', flexDirection: 'column'}}>
                            <span style={{textTransform: 'uppercase', fontSize: 22}}>{row.symbol}</span>
                            <span style={{color: 'darkgrey'}}>{row.name}</span>
                          </div>
                        </TableCell>

                        <TableCell align='right'>
                          {currencySymbol} {numberWithCommas(row.current_price.toFixed(2))}
                        </TableCell>

                        <TableCell
                          align="right"
                          style={{
                            color: isProfit ? 'rgb(14, 203, 129)' : 'red',
                            fontWeight: 500
                          }}
                        >
                          {isProfit && '+'} {row.price_change_percentage_24h.toFixed(2)}%
                        </TableCell>

                        <TableCell align='right'>
                          {currencySymbol} {numberWithCommas(row.market_cap.toString().slice(0, -6))}M
                        </TableCell>
                      </TableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
          )}
        </TableContainer>

        <Pagination 
          count={Number((handleSearchChange()?.length / 10).toFixed(0))}
          onChange={(_, value) => {
            setPage(value)
            window.scroll(0, 450)
          }}
          style={{
            padding: 20,
            display: 'flex',
            width: '100%',
            justifyContent: 'center'
          }}
          classes={{ul: classes.pagination}}
        />
      </Container>
    </ThemeProvider>
  );
};

export default CoinsTable;
