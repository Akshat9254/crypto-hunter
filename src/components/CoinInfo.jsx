import { CircularProgress, createTheme, makeStyles, ThemeProvider } from "@material-ui/core"
import axios from "axios"
import moment from "moment"
import { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import { HistoricalChart } from "../config/api"
import { CryptoState } from "../CryptoContext"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { chartDays } from '../config/chartDays'
import SelectButton from './SelectButton'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });

  const useStyles = makeStyles((theme) => ({
    container: {
        width: '70%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
        padding: 40,
        [theme.breakpoints.down('md')]: {
            width: '100%',
            marginTop: 0,
            padding: 20,
            paddingTop: 0
        }
    }
  }))

const CoinInfo = ({ coin }) => {
    const [historicalData, setHistoricalData] = useState()
    const [days, setDays] = useState(1)

    const { currency } = CryptoState()
    const classes = useStyles()

    const fetchHistoricalData = async () => {
        try {
            const { data } = await axios.get(HistoricalChart(coin.id, days, currency))
            setHistoricalData(data.prices)
        } catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchHistoricalData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currency, days, coin])
  return (
    <ThemeProvider theme={darkTheme}>
        <div className={classes.container}>
            {
                !historicalData ? (
                    <CircularProgress 
                        style={{ color: 'gold' }}
                        size={250}
                        thickness={1}
                    />
                ) : (
                    <>
                        <Line
                            data={{
                                labels: historicalData.map(coin => {
                                    const date = new Date(coin[0])
                                    return days === 1 ? moment(date).format('LT') : moment(date).format('L')
                                }),
                                datasets: [{
                                    data: historicalData.map(coin => coin[1]),
                                    label: `Price (Past ${days} Days) in ${currency}`,
                                    borderColor: '#eebc1d'
                                }]
                            }}
                            options={{
                                elements: {
                                    point: { radius: 1 }
                                }
                            }}
                        />

                        <div style={{display: 'flex', justifyContent: 'space-evenly', marginTop: 20, width: '100%'}}>
                            {
                                chartDays.map(day => (
                                    <SelectButton 
                                        key={day.label}
                                        onClick={() => setDays(day.value)}
                                        selected={day.value === days}
                                    >
                                        { day.label }
                                    </SelectButton>
                                ))
                            }
                        </div>
                    </>
                )
            }
        </div>
    </ThemeProvider>
  )
}

export default CoinInfo