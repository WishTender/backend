const express = require('express');

const exchangeRateRoutes = express.Router();
const ExchangeRateApiInterface = require('../lib/ExchangeRate-Api');

const ratesApi = new ExchangeRateApiInterface();
module.exports = () => {
  exchangeRateRoutes.route('/all').get(async (req, res, next) => {
    const { base } = req.query;
    if (process.env.NODE_ENV === 'production') {
      const rates = await ratesApi.getAllExchangeRates(base);
      return res.status(200).json({ rates });
    }
    return res.status(200).json({
      rates: {
        USD: 1,
        AED: 3.6725,
        AFN: 77.77,
        ALL: 100.6524,
        AMD: 520.8526,
        ANG: 1.79,
        AOA: 649.2108,
        ARS: 94.0921,
        AUD: 1.2908,
        AWG: 1.79,
        AZN: 1.6981,
        BAM: 1.6008,
        BBD: 2.0,
        BDT: 84.7496,
        BGN: 1.601,
        BHD: 0.376,
        BIF: 1967.0043,
        BMD: 1.0,
        BND: 1.3321,
        BOB: 6.8846,
        BRL: 5.2731,
        BSD: 1.0,
        BTN: 73.1634,
        BWP: 10.732,
        BYN: 2.5147,
        BZD: 2.0,
        CAD: 1.2069,
        CDF: 1986.7217,
        CHF: 0.902,
        CLP: 712.663,
        CNY: 6.4346,
        COP: 3646.9819,
        CRC: 615.129,
        CUC: 1.0,
        CUP: 25.75,
        CVE: 90.25,
        CZK: 20.9088,
        DJF: 177.721,
        DKK: 6.1062,
        DOP: 56.9364,
        DZD: 133.3642,
        EGP: 15.6584,
        ERN: 15.0,
        ETB: 42.7627,
        EUR: 0.8185,
        FJD: 2.0251,
        FKP: 0.7057,
        FOK: 6.1062,
        GBP: 0.7057,
        GEL: 3.3725,
        GGP: 0.7057,
        GHS: 5.7599,
        GIP: 0.7057,
        GMD: 51.5056,
        GNF: 9849.067,
        GTQ: 7.7038,
        GYD: 211.5326,
        HKD: 7.7678,
        HNL: 23.9693,
        HRK: 6.1669,
        HTG: 87.4669,
        HUF: 288.3152,
        IDR: 14346.5236,
        ILS: 3.2763,
        IMP: 0.7057,
        INR: 73.164,
        IQD: 1457.3983,
        IRR: 41962.2059,
        ISK: 122.8728,
        JMD: 149.7302,
        JOD: 0.709,
        JPY: 109.1209,
        KES: 107.6948,
        KGS: 84.2852,
        KHR: 4069.5046,
        KID: 1.2908,
        KMF: 402.6672,
        KRW: 1130.114,
        KWD: 0.2996,
        KYD: 0.8333,
        KZT: 427.1126,
        LAK: 9413.8466,
        LBP: 1507.5,
        LKR: 196.821,
        LRD: 171.5796,
        LSL: 14.0586,
        LYD: 4.4521,
        MAD: 8.8025,
        MDL: 17.7569,
        MGA: 3752.873,
        MKD: 50.3426,
        MMK: 1610.5344,
        MNT: 2855.2422,
        MOP: 8.0008,
        MRU: 35.9539,
        MUR: 40.2049,
        MVR: 15.3911,
        MWK: 796.0366,
        MXN: 19.9151,
        MYR: 4.1334,
        MZN: 59.1125,
        NAD: 14.0586,
        NGN: 423.5754,
        NIO: 35.069,
        NOK: 8.2841,
        NPR: 117.0615,
        NZD: 1.3919,
        OMR: 0.3845,
        PAB: 1.0,
        PEN: 3.74,
        PGK: 3.5257,
        PHP: 47.867,
        PKR: 152.9462,
        PLN: 3.7096,
        PYG: 6627.8836,
        QAR: 3.64,
        RON: 4.0347,
        RSD: 96.2223,
        RUB: 73.7011,
        RWF: 1000.0133,
        SAR: 3.75,
        SBD: 7.9225,
        SCR: 16.4063,
        SDG: 398.1988,
        SEK: 8.3319,
        SGD: 1.3321,
        SHP: 0.7057,
        SLL: 10229.9701,
        SOS: 577.9103,
        SRD: 14.1399,
        SSP: 177.6146,
        STN: 20.0528,
        SYP: 1607.3598,
        SZL: 14.0586,
        THB: 31.4671,
        TJS: 11.348,
        TMT: 3.4953,
        TND: 2.7139,
        TOP: 2.2283,
        TRY: 8.4052,
        TTD: 6.7766,
        TVD: 1.2908,
        TWD: 27.9312,
        TZS: 2315.5899,
        UAH: 27.4242,
        UGX: 3548.6602,
        UYU: 44.1358,
        UZS: 10604.8423,
        VES: 2982825.3277,
        VND: 22982.0172,
        VUV: 107.3769,
        WST: 2.5205,
        XAF: 536.8895,
        XCD: 2.7,
        XDR: 0.6926,
        XOF: 536.8895,
        XPF: 97.6712,
        YER: 249.2748,
        ZAR: 14.0594,
        ZMW: 22.4418,
      },
    });
  });
  exchangeRateRoutes.route('/').get(async (req, res, next) => {
    const { base, symbols } = req.query;
    if (process.env.NODE_ENV === 'production') {
      const rate = await ratesApi.getExchangeRate(base, symbols);

      return res.status(200).json({ rate });
    }
    return res.status(200).json({ rate: 1.4777 });
  });

  return exchangeRateRoutes;
};
