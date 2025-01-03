import usdtlogo from "../../images/usdtlogo.svg"
import arrowdown from "../../images/arrowdown.svg"
import user8 from "../../images/user8.svg"
import user12 from "../../images/user12.svg"
import user10 from "../../images/user10.svg"
import downButton from "../../images/wallet/downbutton.svg"
import downButton2 from "../../images/wallet/downbutton2.svg"
import walletIcon from "../../images/wallet/wallet.png"

import { infoicon } from "../../images"

import Activity from "../activity/activity"
import Transactions from "../transactions/transactions"
import Activities from "../activities/activities"
import { useEffect, useState } from "react"
import { useMediaQuery } from "react-responsive"
import Select from 'react-select'
import WithdrawalModal from "../withdrawalModal/withdrawalModal"
import FundingModal from "../fundingModal/fundingModal"
import { baseUrl } from "../../auth/checkauthentication"

function Walletbody(){
    
    const processtransactiondata = () =>{
        let today = new Date().toDateString() //Get today's date
        let day = parseInt(today.split(' ')[1]) //Get the day and convert it to number
        let month = today.split(' ')[2].toLowerCase() //The month converted to lowercase for comparison with transactiondata month
    }

    const [currentMobileDisplay, setCurrentMobileView] = useState('balance')
    const isMobile = useMediaQuery({
        query: '(max-width: 1024px)'
    })

    const [expanded, setExpanded] = useState(false);

    const toggleExpansion = () => {
        setExpanded(!expanded);
    };

    // Filter out the length of the new activities
    const newActivities = activityData.filter(item => item.time.includes('mins'))
    
    const amountEarnedOptions = [
        { value: 'last3months', label: 'Last 3 months' },
        { value: 'last6months', label: 'Last 6 months' },
        { value: 'last12months', label: 'Last 12 months' },        
    ]
    const transactionsHistoryOptions = [{value: 'thismonth', label:'This month'}, ...amountEarnedOptions]
    
    const [selectedAmountEarnedOption, setSelectedAmountEarnedOption] = useState({
        value: 'last3months',
        label: 'Last 3 months'
    })

    const [selectedTransactionsHistoryOption, setSelectedTransactionsHistoryOption] = useState({
        value: 'thismonth',
        label: 'This month'
    })

    //custom dropdown indicator for Select tag/component
    const CustomDropdownIndicator = () => (
            <img src = {arrowdown} alt = 'down arrow' className="w-[12px] md:w-[15px] h-[7px] md:h-[9px] " />
    )

    const [withdrawalModal, setWithdrawalModal] = useState(false)
    const [fundingModal, setFundingModal] = useState(false)

    const [balance, setBalance] = useState({
        walletBalance: '0.00',
        amountEarned: '0.00'
    })

    useEffect(() => {
        // Fetch my wallet balance and amount earned from the server
        const fetchWalletBalance = async () => {
            try {
                const response = await fetch(`${baseUrl}/pay/api/wallet`,{
                    headers:{
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`
                    }
                })
                const resp = await response.json()
                console.log(resp.wallet_balances.total_balance)
                //console.log(resp)
                if (response.ok) {
                    setBalance({
                        walletBalance: resp.wallet_balances.total_balance,
                        amountEarned: resp.wallet_balances.donation
                    })    
                }
            } catch (error) {
                console.error(error)
            }
        }
        fetchWalletBalance()
    },[])

    return(
        <div className = 'fold:px-2 phones:px-[20px] md:px-3 lg:pl-[31px] lg:pr-[43px] pt-8 md:pt-[37px] pb-5 mt-[90px] md:mt-[100px] font-arial w-full h-full '>
            <h1 className="font-black text-[22px] md:text-[32px] mb-[5px] md:mb-4 font-merriweather " >
                Wallet
            </h1>
            <p className=" text-base md:text-lg mb-7 md:mb-8 " >
                Check your wallet balance, withdraw  your funds
            </p>

            <div className="flex lg:hidden md:gap-3 mb-7 " >
                <button className={`py-[7px] phones:py-[10px] px-[12px] phones:px-[15px] 
                    ${currentMobileDisplay == 'balance' ? 'text-white bg-black' : 'text-[#8E8E93]'} rounded-[5px]  text-sm md:text-base `}
                    onClick = {() => setCurrentMobileView('balance') }
                >
                    Balance
                </button>
                <button className={`py-[7px] phones:py-[10px] px-[12px] phones:px-[15px] 
                    ${currentMobileDisplay == 'transactions' ? 'text-white bg-black' : 'text-[#8E8E93]'} rounded-[5px]  text-sm md:text-base `}
                    onClick = {() => setCurrentMobileView('transactions') }
                >
                    Transactions
                </button>
                <button className={`py-[7px] phones:py-[10px] px-[12px] phones:px-[15px] 
                    ${currentMobileDisplay == 'activities' ? 'text-white bg-black' : 'text-[#8E8E93]'} rounded-[5px]  text-sm md:text-base `}
                    onClick = {() => setCurrentMobileView('activities') }
                >
                    Activities
                </button>
            </div>
            
            <div className="lg:flex lg:gap-[64px]" >
                
                <section className="w-full md:w-fit" >
                    <h2 className={` ${ isMobile ? currentMobileDisplay == 'balance' ? '':'hidden' : ''} text-lg md:text-[22px] font-black mb-5 md:mb-[35px] `}>                        
                        Account Balance and Information
                    </h2>
                    <div className={` ${ isMobile ? currentMobileDisplay == 'balance' ? '':'hidden' : ''} flex flex-col w-full `}>
                        
                        <div className="flex flex-col 2xl:flex-row gap-4 lg:gap-7 mb-5 md:mb-12 w-full " >
                            <div className="flex items-center md:justify-center gap-2 phones:gap-5 xl:gap-14 2xl:gap-5 md:min-w-[380px] 2xl:min-w-[350px] 
                                bg-white py-3 phones:py-5 md:py-[25px] 2xl:py-[30px] px-[15px] phones:px-[30px] rounded-[10px]
                                shadow-[0px_0px_16px_rgba(0,0,0,0.04)] w-full "
                            >
                                <img src={walletIcon} alt="USDT logo" className="w-[52px] md:w-[68px] h-[48px] md:h-[64px] "  />
                                <section className="flex flex-col gap-2 md:gap-3" >
                                    <h4 className="text-base md:text-lg text-[#525252]" >Wallet Balance</h4>
                                    <h4 className="text-lg md:text-[22px] font-black leading-6 " >{balance.walletBalance}</h4>
                                    <h4 className="text-base leading-5 text-[#37BCF7] font-black" >+0 NGN </h4>
                                </section>
                            </div>
                            <div className="flex items-center md:justify-center gap-2 phones:gap-5 xl:gap-14 2xl:gap-5 md:min-w-[380px] 2xl:min-w-[350px] 
                                bg-white py-3 phones:py-5 md:py-[25px] 2xl:py-[30px] px-[15px] phones:px-[30px] rounded-[10px]
                                shadow-[0px_0px_16px_rgba(0,0,0,0.04)] "
                            >
                                <img src={walletIcon} alt="USDT logo" className="w-[52px] md:w-[68px] h-[48px] md:h-[64px] "  />
                                <section className="flex flex-col gap-2 md:gap-3" >                                    
                                    <Select
                                        options={amountEarnedOptions}
                                        onChange={(e) => {
                                            setSelectedAmountEarnedOption(e.value)
                                        }}
                                        placeholder='Last 3 months'
                                        components={{
                                            DropdownIndicator: CustomDropdownIndicator,
                                            IndicatorSeparator : () => null
                                        }}
                                        styles={{
                                            control: (base, state) => ({
                                                ...base,
                                                width:'145px',
                                                height:'12px',
                                                border: state.isFocused ? 0 : 0,
                                                // This line disable the blue border
                                                boxShadow: state.isFocused ? 0 : 0,
                                                "&:hover": {
                                                    border: state.isFocused ? 0 : 0,
                                                },
                                                backgroundColor:'#F9F9F9',
                                                cursor:'pointer',
                                                caretColor:'transparent',
                                                paddingRight: isMobile ? '12px' : '16px',
                                                paddingLeft:isMobile ? '6px':'8px',
                                                borderTopLeftRadius:'8px',
                                                borderBottomLeftRadius:'8px',
                                                borderTopRightRadius: isMobile ? '20px' : '24px',
                                                borderBottomRightRadius:isMobile ? '20px' : '24px',
                                                color: 'blue',
                                                z: '10',
                                                fontSize:'12px'
                                            }),
                                            menu: base => ({
                                                ...base,
                                                width: '100%',
                                                zIndex: '30',      
                                                color: 'black',
                                                fontSize:'12px'
                                            }),
                                            menuList: base => ({
                                                ...base,
                                                // kill the white space on first and last option
                                                padding: 0,
                                                fontSize:'12px'
                                            }),
                                            placeholder: base => ({
                                                ...base,
                                                color: 'black',
                                                fontSize:'12px'
                                            })
                                        }}
                                        
                                    />
                                    <h4 className="text-[#525252] text-base md:text-lg " >Amount Earned</h4>
                                    <h4 className="font-black text-lg md:text-[22px] leading-6 " >{balance.amountEarned}</h4>
                                </section>
                            </div>
                        </div>
                        <button className={`text-base text-white bg-[#37BCF7] leading-5 font-black py-[10px] px-[15px] 
                        block w-[85%] md:w-[67%] max-w-[403px] h-[42px] rounded-[5px] md:rounded-[10px] mb-[12px] mx-auto `}
                            onClick={()=> {setWithdrawalModal(true)}}
                        >
                            Withdraw Funds
                        </button>
                        <button className={`text-base text-[#37BCF7] hover:bg-white leading-5 font-black py-[10px] px-[15px] 
                            block w-[85%] md:w-[67%] max-w-[403px] h-[42px] rounded-[5px] md:rounded-[10px] mb-[70px] mx-auto `}
                            onClick={()=> {setFundingModal(true)}}
                        >
                            Fund Wallet
                        </button>
                    </div>
                    
                    <WithdrawalModal withdrawalModal={withdrawalModal} setWithdrawalModal={setWithdrawalModal} />
                    <FundingModal fundingModal={fundingModal} setFundingModal={setFundingModal} />


                    <div className={` ${ isMobile ? currentMobileDisplay == 'transactions' ? 'block':'hidden' : ''} `}>
                        <h4 className="inline-block clear-right leading-6 
                            text-lg md:text-[22px] font-black mb-7 md:4 " >
                            Latest Transactions
                        </h4>
                        {/* <button className="flex float-right bg-[#ffffff] text-xs py-1 pl-[6px] md:pl-2 pr-3 md:pr-4 
                            items-center gap-6 rounded-l-lg rounded-r-[20px] md:rounded-r-3xl " >
                            <span>This month</span>
                            <img src={arrowdown} alt="" className="relative bottom-[2px] w-[12px] md:w-[15px] h-[7px] md:h-[9px] " />
                        </button> */}
                        <div className="flex float-right relative bottom-2 ">
                            <Select
                                options={transactionsHistoryOptions}
                                onChange={(e) => {
                                    setSelectedTransactionsHistoryOption(e.value)
                                }}
                                placeholder='This month'
                                components={{
                                    DropdownIndicator: CustomDropdownIndicator,
                                    IndicatorSeparator : () => null
                                }}
                                styles={{
                                    control: (base, state) => ({
                                        ...base,
                                        width: isMobile ? '120px':'145px',
                                        height:'12px',
                                        border: state.isFocused ? 0 : 0,
                                        // This line disable the blue border
                                        boxShadow: state.isFocused ? 0 : 0,
                                        "&:hover": {
                                            border: state.isFocused ? 0 : 0,
                                        },
                                        backgroundColor:'#ffffff',
                                        cursor:'pointer',
                                        caretColor:'transparent',
                                        paddingRight: isMobile ? '8px' : '16px',
                                        paddingLeft:isMobile ? '4px':'8px',
                                        borderTopLeftRadius:'8px',
                                        borderBottomLeftRadius:'8px',
                                        borderTopRightRadius: isMobile ? '20px' : '24px',
                                        borderBottomRightRadius:isMobile ? '20px' : '24px',
                                        color: 'blue',
                                        z: '10',
                                        fontSize:'12px'
                                    }),
                                    menu: base => ({
                                        ...base,
                                        width: '100%',
                                        zIndex: '30',
                                        color: 'black',
                                        fontSize:'12px'
                                    }),
                                    menuList: base => ({
                                        ...base,
                                        // kill the white space on first and last option
                                        padding: 0,
                                        fontSize:'12px'
                                    }),
                                    placeholder: base => ({
                                        ...base,
                                        color: 'black',
                                        fontSize:'12px'
                                    })
                                }}
                            
                            />
                        </div>
                        {/* <div className="">
                            <div className="mb-12 md:mb-11">
                                <h5 className="text-sm mb-[18px] md:mb-[26px] font-bold md:font-normal " >
                                    Today
                                </h5>
                                {
                                    <div className="flex flex-col gap-5" >
                                        <Transactions type = {'credit'} />
                                        <Transactions type = {'debit'} amt = {12345} />
                                        <Transactions type = {'funding'} amt = {145} />
                                    </div>
                                }
                            </div>
                            <div className="mb-12 md:mb-11">
                                <h5 className="text-sm mb-[18px] md:mb-[26px] font-bold md:font-normal " >
                                    Yesterday
                                </h5>
                                {
                                    <div className="flex flex-col gap-5" >
                                        <Transactions type = {'funding'} amt = {1233225} />
                                        <Transactions type = {'funding'} />
                                        <Transactions type = {'funding'} />
                                    </div>
                                }
                            </div>
                            <div className="mb-12 md:mb-11">
                                <h5 className="text-sm mb-[18px] md:mb-[26px] font-bold md:font-normal " >
                                    March, 2023
                                </h5>
                                {
                                    <div className="flex flex-col gap-5" >
                                    <Transactions type = {'debit'} />
                                    <Transactions type = {'debit'} />
                                    <Transactions type = {'debit'} />
                                    </div>
                                }
                            </div>
                        </div> */}
                        <p className="text-[#8E8E93] text-sm md:text-lg text-center flex gap-2 items-center justify-center" >
                            <img src={infoicon} alt="info icon" className="" />
                            No latest transaction
                        </p>    
                    </div>

                </section>
                                
                <div className={` ${ isMobile ? currentMobileDisplay == 'activities' ? 'block':'hidden' : ''}  `}>
                    {/* <Activities user10 = {user10} user12 = {user12} user8 = {user8} header = {'wallet'} /> */}
                    <section className="font-arial md:flex-1 md:min-w-[320px] md:max-w-[450px] 2xl:min-w-[370px] lg:min-w-[350px] lg:max-w-[370px] lg:bg-white h-fit rounded-[10px] " >
                        <div className={`py-5 md:py-[35px] md:px-[23px] md:border-b-[0.5px] md:border-[#D8D8D8]`}>                
                            <h3 className="text-lg md:text-[22px] font-black mb-[5px] md:mb-3 " >Activites</h3>
                            <p className="text-sm md:text-base" >See  your donation activites for your campaign. </p>
                        </div>
                        <NewActivityNotification number={newActivities.length} />
                        <div className={`md:py-2 md:px-5 flex flex-col gap-4 ${expanded ? 'h-[450px] overflow-scroll activitiesScrollBar' : ''} ${activityData.length ? '': 'flex items-center justify-center'} `} >                            
                            {
                                activityData.length ? activityData.map((item, i) => {
                                    return (
                                        <Activity key={i} userdp={item.userdp} time={item.time} amt={item.amt} username={item.username} />
                                    )
                                }) :
                                <p className="text-[#8E8E93] text-sm md:text-lg flex gap-2 items-center" >
                                    <img src={infoicon} alt="info icon" className="" />
                                    <span>No latest activity </span>
                                </p>
                            }
                        </div>
                        <div className="hidden md:flex flex-col items-center justify-center rounded-b-[10px] py-3 gap-2 " >
                            <span className={`text-xs font-black text-center ${activityData.length ? '' : 'text-[#D8D8D8]'} `} >
                                { expanded ? 'Click on button to go up' : 'Click on button to go down' }
                            </span>
                            <img 
                                src={activityData.length? downButton: downButton2} 
                                alt="down button" 
                                className={`w-8 cursor-pointer transform ${expanded ?  'rotate-180 duration-slow' :'duration-slow'  }`}
                                onClick={toggleExpansion} 
                            />
                        </div>
                    </section>
                    
                </div>

            </div>
        </div>
    )
}

export default Walletbody

const NewActivityNotification = (props) => {

    return (
        <div className={` ${props.number < 1 ? 'hidden' : ''} bg-[#37BCF7] rounded-full px-3 py-2 text-sm md:text-base font-black w-fit mt-1 mb-3 md:mt-3 md:mb-1 md:ml-3`}>
            {props.number} new {props.number > 1 ? 'activities' : 'activity'}
        </div>
    )
}


let activityData = [
    /* {
        userdp: user12,
        username: 'Doggo',
        time: '5 mins ago',
        amt: '5000',
        activity: 'Made a donation of 500USDT to your crowdfund campaign'
    },
    {
        userdp: user8,
        username: 'EricatheBoss',
        time: '10 mins ago',
        amt: '100',
        activity: 'Made a donation of 500USDT to your crowdfund campaign'
    },
    {
        userdp: user10,
        username: 'Anonymous',
        time: '1 hour ago',
        amt: '10',
        activity: 'Made a donation of 500USDT to your crowdfund campaign'
    },
    {
        userdp: user8,
        username: 'Sir Bob',
        time: '7 hours ago',
        amt: '200',
        activity: 'Made a donation of 500USDT to your crowdfund campaign'
    },
    {
        userdp: user12,
        username: 'Micheal',
        time: '20 hours ago',
        amt: '120000',
        activity: 'Made a donation of 500USDT to your crowdfund campaign'
    }, */
    
]

let transactionsdata = [
    {
        type:'credit',
        date:'may 5, 2023',
        amount:'3000 USDT'
    },
    {
        type:'debit',
        date:'may 5, 2023',
        amount:'127893 USDT'
    },
    {
        type:'funding',
        date:'may 5, 2023',
        amount:'10000 USDT'
    },
    {
        type:'funding',
        date:'may 4, 2023',
        amount:'100 USDT',
    },
    {
        type:'funding',
        date:'may 5, 2023',
        amount:'234 USDT'
    },
    {
        type:'funding',
        date:'may 4, 2023',
        amount:'1000000 USDT'
    },
    {
        type:'debit',
        date:'may 3, 2023',
        amount:'5000 USDT'
    },
    {
        type:'debit',
        date:'may 3, 2023',
        amount:'12000 USDT'
    },
    {
        type:'debit',
        date:'may 3, 2023',
        amount:'89300 USDT'
    },
    {
        type:'debit',
        date:'may 1, 2023',
        amount:'5332 USDT'
    },
    {
        type:'debit',
        date:'april 20, 2023',
        amount:'4300 USDT'
    },
]