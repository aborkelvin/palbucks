import backArrow from "../../images/backarrow.svg"
import amexCanadaImg from "../../images/cardDonation/Amex Canada.svg"
import mastercardImg from "../../images/cardDonation/Mastercard.svg"
import visaIncImg from "../../images/cardDonation/Visa Inc.svg"
import verveImg from "../../images/cardDonation/verve.png"
import calendarImg from "../../images/cardDonation/calendar.svg"
import creditCardImg from "../../images/cardDonation/credit-card.svg"
import lockImg from "../../images/cardDonation/lock.svg"
import lockImg2 from "../../images/cardDonation/lock2.svg"
import heartIcon from "../../images/cardDonation/heart.svg"
import successIcon from "../../images/cardDonation/success2.png"
import whatsappIcon from "../../images/cardDonation/whatsapp.svg"
import twitterIcon from "../../images/cardDonation/twitter.svg"
import copyIcon from "../../images/cardDonation/copy.svg"
import mailIcon from "../../images/cardDonation/mail.svg"
import facebookIcon from "../../images/cardDonation/facebook.svg"
import usdIcon from "../../images/cardDonation/usd.svg"
import nairaIcon from "../../images/cardDonation/naira.svg"
import downArrowIcon from "../../images/cardDonation/downArrow.svg"


import Navbar from '../../components/navbar/navbar'
import Loadingspinner from "../../components/loadingspinner/loadingSpinner"
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from "react-router-dom"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import Select from 'react-select'
import { baseUrl } from "../../auth/checkauthentication"
import { useMediaQuery } from "react-responsive"
import CryptoDonationModal from "../../components/cryptoDonationModal/cryptoDonationModal"

export default function Donate() {

    const [donationDetails, setdonationDetails] = useState({
        amount: '',
        donor: '',
        cardNumber: '',
        expirationDate: '',
        cvv: '',
        cardName: ''
    })
        
    // Obtain the crowdfund id and the payment status id (if available) from the url
    const params = useParams()
    const id = params.id
    const [searchParams] = useSearchParams();
    
    const isMobile = useMediaQuery({
        query: '(max-width: 768px)'
    })
    useEffect(() => {
        // Access the individual query parameters
        const status = searchParams.get('status');
        const txn_ref = searchParams.get('reference');
        const transaction_id = searchParams.get('transaction_id');
        console.log(txn_ref)
        let verifyCount = 0;
        /* if (status === 'successful' ){ */
        if(txn_ref){
            setpageDisplay('verifyingPayment')

            // Make an api call to verify the transaction
            const access_token = localStorage.getItem('access_token')
            const verifyTransaction = async() => {
                const verify = await fetch(`${baseUrl}/pay/api/${id}/donate/?txn_ref=${txn_ref}&transaction_id=${transaction_id}`,{
                    headers:{
                        Authorization: `Bearer ${access_token}`,
                        'Content-Type': 'application/json'
                    },
                    /* body: JSON.stringify({
                        tx_ref: tx_ref,
                        transaction_id: transaction_id
                    }) */
                })
                const response = await verify.json()
                console.log(response)
                if(verify.status == 200){
                    //window.open(response.data.link, '_blank')
                    
                    // If payment is still pending, setTimeout to verify again
                    if (response.data.status == "completed") {
                        setpageDisplay('donationSuccessful')
                    } else if (response.data.status == "pending") {
                        if (verifyCount > 5) {
                            alert('An error occured we couldnt verify this payment,Please refresh the page or try again')
                            setpageDisplay('donationDetails')
                            return;
                        }
                        setTimeout(() => {
                            verifyTransaction()
                        }, 5000);
                        verifyCount += 1;
                    } else {
                        alert('An error occured we couldnt verify this payment,Please refresh the page or try again')
                        setpageDisplay('donationDetails')
                    }
                    
                }else{
                    alert('An error occured we couldnt verify this payment,Please refresh the page or try again')
                    setpageDisplay('donationDetails')
                }
            }
            verifyTransaction()


        }else{
            setpageDisplay('donationDetails')
        }
    }, [searchParams]);

    const crowdfundEvents = useSelector(state => state.crowdfundEvents)
    //const crowdfund = crowdfundEvents.find(crowdfund => crowdfund.id == id)
    const [crowdfund, setCrowdfund] = useState(crowdfundEvents.find(crowdfund => crowdfund.id == id))
    console.log(crowdfund)
    useEffect(() => {
        if (!crowdfund) {
            //alert('m')
            const getCrowdfund = async () => {
                const response = await fetch(`${baseUrl}/funding/api/${id}`, {
                    /* headers: {
                        Authorization: `Bearer ${access_token}`,                    
                    } */
                })

                if (response.ok) {
                    let data = await response.json()        
                    console.log(data)
                    setCrowdfund(data)
                    //totaldonations = formatnumber(data.no_of_donors)

                } else {
                    console.error(await response.json())                    
                }
            }        
            getCrowdfund()        
        }
    }, [])

    const [displayModals, setDisplayModals] = useState({
        cryptoDonationModal: false,
        cryptoDonationData: {
            payment_id: "5428124683",
            payment_status: "waiting",
            pay_address: "0x4Ffc8580870272E52a8eB07cb2B89fC5fE4402bF",
            pay_amount: 100,
            pay_currency: "usdtbsc",
            order_id: "73282b3d-2afc-4d5e-aba5-f6feced5fcf3",
            expiration_estimate_date: "2024-02-04T19:43:15.177Z"
        }
    })
    
    

    const navigate = useNavigate()
    const [pageDisplay, setpageDisplay] = useState('donationSuccessful')

    if (!crowdfund) {
        console.log("No crowdfund")
        return <div>Loading...</div>;
    }    
    return (
        <div className='bg-[#F9F9F9] min-h-full font-arial ' >
            <Navbar sidebar = {false} onDonorPage = {true} />
            <div className= {`mt-[90px] md:mt-[100px] py-[46px] fold:px-1 phones:px-4 md:px-10 lg:px-[94px]`} >
                <div className="mb-[30px] md:mb-[99px] flex gap-[10px] md:gap-6 cursor-pointer justify-center md:justify-start"
                    onClick={
                        ()=>{
                            if(pageDisplay == 'donationDetails' || pageDisplay == 'donationSuccessful' ){
                                navigate(`/detailed/${id}`)
                            }else if(pageDisplay == 'cardDetails'){
                                setpageDisplay('donationDetails')
                            }
                        }
                    }
                >
                    <img src={backArrow} alt="Go back" className="w-[21px] md:w-[32px]"  />
                    <p className="text-sm font-bold md:text-[23px] md:tracking-[0.062px] md:leading-9 " >
                        {
                            pageDisplay == 'donationDetails' ?
                             'Go back to campaign page':
                            pageDisplay == 'cardDetails' ?
                            'Go back to donation amount':
                            pageDisplay == 'donationSuccessful' ?
                            'Go back to campaign page':
                            null
                        }
                    </p>
                </div>
                <div className="mb-4 md:mb-[30px] mx-auto w-fit flex gap-[5px] items-center" >
                    <div 
                        className="w-8 md:w-10 h-8 md:h-10 bg-[#35FAA0] rounded-full flex items-center justify-center text-base md:text-lg font-bold " >
                        1
                    </div>
                    <hr className=" w-[30px] md:w-[103px] bg-[#D2F9E7] h-[6px] " />
                    <div
                        className={` ${pageDisplay !== 'donationDetails'? 'bg-[#35FAA0]' : 'bg-[#35FAA033]' }
                        w-8 md:w-10 h-8 md:h-10 rounded-full flex items-center justify-center text-base md:text-lg font-bold
                        `}
                    >
                        2
                    </div>
                    <hr className=" w-[30px] md:w-[103px] bg-[#D2F9E7] h-[6px] " />
                    <div
                        className={` ${pageDisplay == 'donationSuccessful' ? 'bg-[#35FAA0]' : 'bg-[#35FAA033]' }
                        w-8 md:w-10 h-8 md:h-10 rounded-full flex items-center justify-center text-base md:text-lg font-bold
                        `}
                    >
                        3
                    </div>
                </div>
                {
                    pageDisplay == 'donationDetails' ?
                    <DonationDetails id={id} setpageDisplay = {setpageDisplay} donationDetails = {donationDetails} setdonationDetails = {setdonationDetails} isMobile = {isMobile} displayModals = {displayModals} setDisplayModals = {setDisplayModals} crowdfund = {crowdfund} /> :
                    pageDisplay == 'cardDetails' ?
                    <CardDetails setpageDisplay={setpageDisplay} donationDetails = {donationDetails} setdonationDetails = {setdonationDetails} /> :
                    pageDisplay == 'donationSuccessful' ?
                    <DonationSuccessful /> :
                    pageDisplay == 'verifyingPayment' ?
                    <PaymentLoading /> :
                    null
                }
                
            </div>
            <CryptoDonationModal 
                displayModals={displayModals}
                setDisplayModals={setDisplayModals}
                eventid={id}                                        
            />
            
        </div>
    )
}


const DonationDetails = ({id, setpageDisplay , donationDetails , setdonationDetails, isMobile , displayModals, setDisplayModals, crowdfund}) => {

    
    //const crowdfundEvents = useSelector(state => state.crowdfundEvents)
    //const crowdfund = crowdfundEvents.find(crowdfund => crowdfund.id == id)
    

    const [cryptoDonationAmount, setCryptoDonationAmount] = useState(0)
    const paymentMode = useSelector(state => state.paymentMode)

    const handleInputChange = (e) => {
        if (paymentMode == 'crypto') {
            setCryptoDonationAmount(e.target.value)
        } else if (paymentMode == 'fiat') {
            setdonationDetails({
            ...donationDetails,
            [e.target.name]: e.target.value
        })
        }        
    }

    const [isLoading, setIsLoading] = useState(false)
    
    const handleClick = async () => {
        
        if (paymentMode == 'crypto') {   
            
            setIsLoading(true)
            if (cryptoDonationAmount == 0) {
                alert('Please fill in the amount of usdt you wish to donate')
                setIsLoading(false)
                return
            } else if (cryptoDonationAmount < 1) {
                alert('Please enter a valid amount')
                setIsLoading(false)
                return
            }
            const makeDonation = await fetch(`${baseUrl}/pay/api/${id}/donate-crypto/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: cryptoDonationAmount,
                    currency: "usdtbsc"
                })
            })       
            const resp = await makeDonation.json()
            console.log(resp)     
            console.log(makeDonation.status);
            if (makeDonation.status === 200) {
                setDisplayModals((prev) => ({
                    ...prev,
                    cryptoDonationModal: true,
                    cryptoDonationData: resp
                }))                                    
            } else {
                console.log('error')
            }  
            setIsLoading(false)

        }else if(paymentMode == 'fiat'){
            setIsLoading(true)
            if(donationDetails.amount == ''){
                alert('Please fill in the amount you wish to donate')
                setIsLoading(false)
                return
            }else if(donationDetails.amount < 1){
                alert('Please enter a valid amount')
                setIsLoading(false)
                return
            }
            
            /* setpageDisplay('cardDetails');
            window.scrollTo(0,0) */
            console.log(donationDetails.amount, typeof(selectedCurrency.value))

            const access_token = localStorage.getItem('access_token')
            
            // Old payment api commented out to try the new one
            const makeDonation = await fetch(`${baseUrl}/pay/api/${id}/donate/`,{
                method:'POST',
                headers: {
                    // Set the authorization to bearer access token only if access token exists, else ignore the authorization else ignore the authorization and add an  "anonymous_donor": "sirconnell.ik@gmail.com"  key/value to the body
                    
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: donationDetails.amount,
                    currency: selectedCurrency.value,
                    channel:"rexpay", // [squad, rexpay]
                    //donor: donationDetails.donor
                })
            })
            const response = await makeDonation.json()
            console.log(response)
            if (makeDonation.status == 200) {
                //console.log(makeDonation.status)
                window.open(response.data.url, '_self')
            }else if(response.status == 400 && response.message == "Minimum amount is 100 Naira" ){
                alert('Minimum amount is 100 Naira')
            } else {
                alert('An error occured, please try again')
            }

            setIsLoading(false)    

            //const makePayment = await fetch(`${}`)
        }
        
    }

    const options = [
        {value:'USD' , label:'', image:usdIcon},
        {value:'NGN', label:'', image:nairaIcon}
    ]
    const [selectedCurrency, setSelectedCurrency] = useState(options[0])
    const customStyles = {
        control: (provided, state) => ({
          ...provided,
          position: 'absolute',
          right: '20px',
          top: '50%', // Vertically center the Select
          transform: 'translateY(-50%)',
          width: isMobile ? '60px' :'70px', // Set the desired width for the options menu
          height: isMobile ? '40px' :'50px',
          border:'0',
          caretColor: 'transparent',  // Remove the blinker
          boxShadow: state.isFocused ? 0 : 0, //Disable the blue line
          cursor: 'pointer',
        }),
        menu: (provided) => ({
          ...provided,
          cursor: 'pointer',
          position: 'absolute',
          top:'22px',
          right: '10px',
          width: '70px', // Set the desired width for the options menu
        }),   
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
            // const color = chroma(data.color);            
            return {
              ...styles,
              backgroundColor: isSelected ? "#37BCF7" : isFocused ? "#37BCF71A" : null, // Set the color for a focused option              
            };
        }

    };

    const CustomDropdownIndicator = () => (        
        <img src={downArrowIcon} alt="down arrow" className="w-5 md:w-7 h-5 md:h-7" />
    );   
      
    return(
        <div className="">
            <div className="mb-[25px] md:mb-[68px] bg-white p-[13px] md:py-[37px] md:px-[59px] max-w-[670px] mx-auto rounded md:rounded-[10px] " >
                <div className="mb-[38px] md:mb-[58px] flex gap-4 md:gap-7 " >
                    <img src={crowdfund.banner} alt="crowdfund banner" className="w-[77px] md:w-[153px] h-[68px] md:h-[100px] object-cover rounded " />
                    <p className="text-sm md:text-xl tracking-[0.069px] " >
                        You are donating to the  <span className="font-black" >
                            {
                                crowdfund.title
                            }
                        </span> campaign
                    </p>
                </div>
                <div className="flex flex-col gap-3 md:gap-5" >
                    <label htmlFor="amount" className="text-sm md:text-lg font-bold" >
                        What amount do you wish to donate?
                    </label>
                    <div className="relative h-12 md:h-[70px] flex items-center ">
                        <input
                            type="number"
                            name="amount"
                            id="amount"
                            min={1}
                            placeholder={selectedCurrency.value == 'usd' ? "Enter your donation (in USD)" : selectedCurrency.value == 'naira' ? "Enter your donation (in Naira)" : "Enter your donation"}
                            className="w-full h-12 md:h-[70px] py-1 md:py-[10px] px-3 md:px-5 border-[1.5px] border-black rounded bg-white
                            placeholder-[#888888] text-sm md:text-lg tracking-[0.8px] focus:border-2 focus:border-[#37BCF7] focus:caret-[#2CA9F2] "
                            onChange={handleInputChange}
                        />
                        <Select
                            defaultValue={options[0]}
                            onChange={setSelectedCurrency}
                            options={options}
                            styles = {customStyles}
                            components = {{
                                IndicatorSeparator: () => null,
                                DropdownIndicator: CustomDropdownIndicator,
                            }}                                                        
                            formatOptionLabel={option =>
                                (
                                    <img src={option.image} alt="option" className="w-3 md:w-5 h-3 md:h-6" />                                
                                )
                            }
                        />
                    </div>
                </div>
                
            </div>

            <button className="mx-auto w-fit min-w-[200px] md:min-w-[280px] block py-[10px] md:py-5 px-[18px] md:px-9 rounded md:rounded-lg bg-[#000000] 
            text-white text-[15px] md:text-[28px] font-bold md:leading-[43px] md:-tracking-[0.188px] " 
                onClick={ handleClick }
            >
                
                <div className={` ${isLoading ? 'block' : 'hidden' } `}>
                    <Loadingspinner width = '28px' height = '28px' />
                </div>
                <span className={` ${isLoading ? 'hidden' : 'block' } `} >
                    Make a donation
                </span>
            </button>
        </div>
    )

}

const CardDetails = ({setpageDisplay, donationDetails , setdonationDetails}) => {
    
    const [isLoading , setisLoading] = useState(false)
    const handleInputChange = (e) => {
        setdonationDetails({
            ...donationDetails,
            [e.target.name]: e.target.value
        })
    }

    function cardValidation(donationDetails) {
        const cardNumberPattern = /^(?:[0-9]{13,19})$/;
        const cvvPattern = /^(?:[0-9]{3,4})$/;
        const expirationDatePattern = /^(0[1-9]|1[0-2])\/([2-3][0-9])$/;
    
        if (!donationDetails.cardNumber.match(cardNumberPattern)) {
            alert('Invalid card number');
            return false;
        }
    
        if (!donationDetails.expirationDate.match(expirationDatePattern)) {
            alert('Invalid expiration date (mm/yy)');
            return false;
        }

        const [inputMonth, inputYear] = donationDetails.expirationDate.split('/');
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;

        if (Number(inputYear) < currentYear || (Number(inputYear) === currentYear && Number(inputMonth) < currentMonth)) {
            alert('Card is expired');
            return;
        }
    
        if (!donationDetails.cvv.match(cvvPattern)) {
            alert('Invalid CVV');
            return false;
        }
    
        if (donationDetails.cardName.trim() === '') {
            alert('Please fill in your card name');
            return false;
        }


    
        return true;
    }
    
    const handleDonation = (e) => { 
        setisLoading(true)
        e.preventDefault();
    
        if (cardValidation(donationDetails)) {
            // Proceed with further processing
            setpageDisplay('donationSuccessful');
            window.scrollTo(0, 0);
        }
        setisLoading(false)
    };
    

    return(
        <div className="">

            <div className="mb-[57px] bg-white max-w-[700px] mx-auto shadow-[0px_0px_32px_0px_rgba(0,0,0,0.04)] rounded-[10px] " >
                <div className=" py-[31px] pl-[50px] pr-[30px] border-b-2 border-[#dfdbdb] ">
                    <h2 className="text-[28px] font-black tracking-[0.069px] leading-10 " >
                        Enter your card details
                    </h2>
                </div>
                <div className="py-[37px] px-[59px] flex flex-col gap-[58px] " >

                    <div className="flex flex-col gap-5" >
                        <label htmlFor="cardNumber" className="flex items-center justify-between " >
                            <div className="flex items-center gap-[10px]" >
                                <img src={creditCardImg} alt="credit card" className="w-6 h-6" />
                                <p className="text-lg font-bold" >
                                    Card number (Credit or debit)
                                </p>
                            </div>
                            <div className="flex gap-[15px] items-center justify-center " >
                                <img src={visaIncImg} alt="visa inc" className="w-[35px] h-3"  />
                                <img src={mastercardImg} alt="mastercard" className=" w-[35px] h-[21px] " />
                                <img src={verveImg} alt="visa Inc" className="w-[35px] h-3 " />
                                <img src={amexCanadaImg} alt="amex canada" className="w-[35px] h-[35px] " />
                            </div>
                        </label>
                        <div className="relative h-fit flex items-center" >
                            <input
                                type="number"
                                name="cardNumber"
                                id="cardNumber"
                                placeholder="Enter your card number"
                                className="w-full h-[70px] py-[10px] px-5 border-[1.5px] border-black rounded bg-white
                                text-[#888888] text-lg tracking-[0.8px] "
                                onChange={handleInputChange}
                            />
                            <img src={lockImg2} alt="Lock" className="absolute right-5 m-auto " />
                        </div>
                    </div>
                    <div className="flex md:gap-[48px] items-center justify-between" >
                        <div className="flex flex-col gap-5" >
                            <label htmlFor="expirationDate" className="flex items-center gap-[10px] " >
                                <img src={calendarImg} alt="expiry date" className="w-6 h-6" />
                                <p className="text-lg font-bold" >
                                    Expiration date
                                </p>
                            </label>
                            <input
                                type="text"
                                name="expirationDate"
                                id="expirationDate"
                                placeholder="mm/yy"
                                className="w-full h-[70px] py-[10px] px-5 border-[1.5px] border-black rounded bg-white
                                text-[#888888] text-lg tracking-[0.8px] "
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="flex flex-col gap-5" >
                            <label htmlFor="cvv" className="flex items-center md:gap-20 justify-between" >
                                <div className="flex items-center gap-[10px]" >
                                    <img src={lockImg} alt="lock" />
                                    <p className="text-lg font-bold" >
                                        CVV
                                    </p>
                                </div>
                                <p className="text-[#2CA9F2] font-black " >
                                    What is this?
                                </p>
                            </label>
                            <input
                                type="number"
                                name="cvv"
                                id="cvv"
                                placeholder="123"
                                className="w-full h-[70px] py-[10px] px-5 border-[1.5px] border-black rounded bg-white
                                text-[#888888] text-lg tracking-[0.8px] "
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-5" >
                        <label htmlFor="cardName" className="text-lg font-bold" >
                            Name on card
                        </label>
                        <input
                            type="text"
                            name="cardName"
                            id="cardName"
                            placeholder="Enter the name on your card "
                            className="w-full h-[70px] py-[10px] px-5 border-[1.5px] border-black rounded bg-white
                            text-[#888888] text-lg tracking-[0.8px] "
                            onChange={handleInputChange}
                        />
                    </div>

                </div>

            </div>

            <button className="mx-auto w-fit min-w-[280px] md:min-w-[350px] block py-5 px-9 rounded-lg bg-[#000000] 
            text-white text-[28px] font-bold leading-[43px] -tracking-[0.188px] " 
                onClick={ handleDonation } 
            >
                
                <div className={` ${isLoading ? 'block' : 'hidden' } `}>
                    <Loadingspinner width = '28px' height = '28px' />
                </div>
                <span className={` ${isLoading ? 'hidden' : 'block' } `} >
                    Donate now
                </span>
            </button>

        </div>        
    )

}

const DonationSuccessful = () => {
    
    return(
        <div className="">

            <div className="mb-[57px] bg-white max-w-[788px] mx-auto shadow-[0px_0px_32px_0px_rgba(0,0,0,0.04)] rounded-[10px] " >
                <div className=" py-[31px] px-[48px] border-b-2 border-[#dfdbdb] flex gap-[15px] items-center justify-center ">
                    <img src={heartIcon} alt="heart icon" className=" w-[30px] h-[30px] " />
                    <h2 className="text-xl font-black tracking-[0.069px] text-center " >
                        Thank you for your donation, you are simply a joy to the world.
                    </h2>
                </div>
                <div className="pt-5 pb-[38px] px-[52px] " >
                    <img src={successIcon} alt="donation successful" className="w-[114px] h-[120px] mx-auto rotate-[35.26deg] " />
                    <h3 className="mb-4 text-[28px] font-black text-center " >
                        Help this campaign be a complete success
                    </h3>
                    <p className="mb-[31px] text-xl text-center tracking-[0.069px]" >
                        Use the social links below to share this campaign around the world. By doing so, this campaign will certainly be a success  
                    </p>
                    <hr className="mb-[22px] w-[90%] h-[0.5px] bg-black mx-auto " />
                    <div className="mb-[49px] flex justify-between gap-2 " >
                        <div className="flex items-center justify-center gap-[17px] cursor-pointer bg-[#35FAA01A] py-[10px] px-[31px] rounded-[10px] ">
                            <img src={facebookIcon} alt="facebook link" className="w-[25px] h-[25px] " />
                            <span className="text-[22px] " >
                                Facebook
                            </span>
                        </div>
                        <div className="flex items-center justify-center gap-[17px] cursor-pointer bg-[#35FAA01A] py-[10px] px-[31px] rounded-[10px] ">
                            <img src={whatsappIcon} alt="whatsapp link" className="w-[25px] h-[25px] " />
                            <span className="text-[22px]" >
                                Whatsapp
                            </span>
                        </div>
                        <div className="flex items-center justify-center gap-[17px] cursor-pointer bg-[#35FAA01A] py-[10px] px-[31px] rounded-[10px] ">
                            <img src={twitterIcon} alt="twitter link" className="w-[25px] h-[25px] " />
                            <span className="text-[22px]" >
                                Twitter
                            </span>
                        </div>
                    </div>
                    <div className="flex justify-center gap-10 " >
                        <div className="flex items-center justify-center gap-[17px] cursor-pointer border-[1px] border-black py-[10px] px-[31px] rounded-[10px] md:w-[250px] ">
                            <img src={mailIcon} alt="mail link" className="w-[25px] h-[25px] " />
                            <span className="text-[22px]" >
                                Send Email
                            </span>
                        </div>
                        <div className="flex items-center justify-center gap-[17px] cursor-pointer border-[1px] border-black py-[10px] px-[31px] rounded-[10px] md:w-[250px] ">
                            <img src={copyIcon} alt="copy link" className="w-[25px] h-[25px] " />
                            <span className="text-[22px]" >
                                Copy link
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <button className="mx-auto w-fit min-w-[280px] md:min-w-[350px] block py-5 px-9 rounded-lg bg-[#000000] 
            text-white text-[28px] font-bold leading-[43px] -tracking-[0.188px] "                 
            >
                View your receipt
            </button>

        </div>        
    )

}


// Payment Loading Component to be displayed while verifying the payment transaction
const PaymentLoading = () => {

    return(
        <div className="mb-[68px] bg-white py-[37px] px-[59px] max-w-[670px] mx-auto rounded-[10px] " >
            <h1 className="text-lg" >
                Payment Pending
            </h1>
            <p className="text-lg" >
                Please wait while we verify your payment
            </p>
        </div>
    )
}