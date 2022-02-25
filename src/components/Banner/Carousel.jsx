import { makeStyles } from '@material-ui/core'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { TrendingCoins } from '../../config/api'
import { CryptoState } from '../../CryptoContext'
import AliceCarousel from 'react-alice-carousel'
import { Link } from 'react-router-dom'

const useStyles = makeStyles(() => ({
    carousel: {
        height: '50%',
        display: 'flex',
        alignItems: 'center'
    },
    carouselItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        textTransform: 'uppercase',
        color: '#fff'
    }
}))

 const fetchTendingCoins = async (currency, setTrending) => {
    try {
        const {data} = await axios.get(TrendingCoins(currency))
        setTrending(data)
    } catch(err) {
        console.log(err)
    }
}

const numberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const Carousel = () => {
    const [trending, setTrending] = useState([])
    const classes = useStyles()
    const {currency, currencySymbol} = CryptoState()

    useEffect(() => {
        fetchTendingCoins(currency, setTrending)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currency])

    const items = trending.map(coin => {
        const isProfit = coin.price_change_percentage_24h >= 0
        
        return (
        <Link 
            className={classes.carouselItem} 
            to={`/coins/${coin.id}`}
        >
            <img 
                src={coin?.image} 
                alt={coin.name}
                height='80'
                style={{marginBottom: 10}} 
            />
            <span>{coin?.name}</span>
            &nbsp;
            <span
                style={{color: isProfit ? 'rgb(14, 203, 129)' : 'red', fontWeight: 500}}    
            >
                {isProfit && '+'} {coin?.price_change_percentage_24h?.toFixed(2)}
            </span>
            <span style={{fontSize: 22, fontWeight: 500}}>
                {currencySymbol} {numberWithCommas(coin?.current_price.toFixed(2))}
            </span>
        </Link>
    )})

    const responsive = {
        0: {
            items: 2
        },
        512: {
            items: 4
        }
    }

  return (
    <div className={classes.carousel}>
        <AliceCarousel 
            mouseTracking
            infinite
            autoPlayInterval={1000}
            animationDuration={1500}
            disableDotsControls
            disableButtonsControls
            responsive={responsive}
            autoPlay
            items={items}    
        />
    </div>
  )
}

export default Carousel