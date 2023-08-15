import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { elementSKUs, sizePrices, screenPricing, splinePricing, spreaderBarPricing, pullTabPricing, springPricing, spreaderBarClip, clipSpring, screenClips, hawaiiTaxRate  } from '../config';


const currentDate: Date = new Date();

const day: number = currentDate.getDate();
const month: number = currentDate.getMonth() + 1;
const year: number = currentDate.getFullYear();


const configToImgMap = {
    "Blank - Custom": 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6CAYAAACI7Fo9AAAACXBIWXMAAC4jAAAuIwF4pT92AAAEKklEQVR4nO3b22ocRxRA0dOxDcFv+f+PDIRcSGKp8zAzRFGMIbGmuj17LRCjhkFVL7ur+qJt3/d9gIf23dETAO5P6BAgdAgQOgQIHQKEDgsd9ZDr/crBtm1bORyc2srol4Y+c9wZDc5k9aJn6w4BQoeA5Vv3l1yzU3LkZeuhoc+4Zqfh6EXN1h0ChA53doZdq9Dhzo7ets8IHRKEDgFChwChQ4DQIUDoECB0CBA6BAgdAoQOAUKHAKFDwKGhn+FlfyiwokPAoaGf4f90ocCKDgFChwChQ4DQIUDoECB0CBA6BAgdAoQOAUKHAKFDgNAhQOgQIHQIEDoECB0ChA4BQocAoUOA0CFA6BAgdAgQOgQIHQKEDgFChwChQ4DQIUDoECB0CBA6BAgdAoQOAUKHAKFDgNAhQOgQIHQIEDoECB0ChA4BQocAoUOA0CFA6BAgdAgQOgQIHQKEDgFChwChQ4DQIUDoECB0CBA6BAgdAoQOAUKHAKFDgNAhQOgQIHQIEDoECB0ChA4BQocAoUOA0CFA6BAgdAgQOgQIHQKEDgFChwChQ4DQIUDoECB0CBA6BAgdAoQOAUKHAKFDgNAhQOgQIHQIEDoECB0ChA4BQocAoUOA0CFA6BAgdAgQOgQIHQKEDgFChwChQ4DQIUDoECB0CBA6BAgdAoQOAUKHAKFDgNAhQOgQIHQIEDoECB0ChA4BQocAoUOA0CFA6BAgdAgQOgQIHQKEDgFChwChQ4DQIUDoECB0CBA6BAgdAoQOAUKHAKFDgNAhQOgQIHQIEDoECB0ChA4BQocAoUOA0CFA6BAgdAgQOgQIHQKEDgFChwChQ4DQIUDoECB0CBA6BAgdAoQOAUKHAKFDgNAhQOgQIHQIEDoECB0ChA4BQocAoUOA0CFA6BAgdAgQOgQIHQKEDgFChwChQ4DQIUDoECB0CBA6BAgdAoQOAUKHAKFDgNAhQOgQIHQIEDoECB0ChA4BQocAoUOA0CFA6BAgdAgQOgQIHQKEDgFChwChQ4DQIeDsoT8fPQF4BGcNfZ+ZX4+eBDyKM4b+NDPbzHycc84PvjlnCum2TX936CzgAZ0p9DPNBR7KWeJ6nst1OXAHZwh9n8s8thfHwBs6Q+i/XD9v1+i34J9m5o8RPny190dPYC4nm9uqfvN0PXZjDt7AGUL/+Op4v/5sn/ku8D+cYev+OWc4AcHDOCKoH2fmh5mZbdtm2/61cFvJ4Y1t+74vu9m1bdssHA5Oa3ULR23d/3zx+/7qGHhjR4X+4fr521y26h++8F3gKy3fugMXK7fu974Z99NcVuvvZ2b2fX+ay7NxxcNC917Rn+e8j/Ag4x4RfprLm233+vvAf3TPFf22mn+af77matsOiy29GTd/v95qpYeFVgV3O5lsC8cErlZF9/vM/LxoLOCVvwDvql7DXX692wAAAABJRU5ErkJggg==',
    "Angled - Blank": 'data:image/png;base64,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',
    "Angled - Springs & Tabs": 'data:image/png;base64,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',
    "Angled - Springs, Tabs & Spreader Bar": 'data:image/png;base64,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',
    "Angled - Blank & Spreader Bar": 'data:image/png;base64,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',
    "Angled - Narrow - Springs & Tabs": 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6CAYAAACI7Fo9AAAACXBIWXMAAC4jAAAuIwF4pT92AAAIx0lEQVR4nO3bP2gT/x/H8df9KhW7OKWTOmW01clqwYKm6qCtoEuLm+JgQagIgovgn8FJaUEcRFEQKaJLRERJioIOxaGldVDazUKhGWqHJjSafn6DtL9q9fv7+ufuqq/nAzJUknzeCfdM7i5nFEIIAvBX+0/aAwCIX2yhj42Nqb29XaVSKa4lgD9eqVTSzp07NTIyEus6sYXe29urYrFI7MB3zM7Oat++fXr58qVOnToV61qxhT4wMKDm5maNjo4SO/CVcrmsgwcPanh4WNlsVvfv3491vdhCz2QyKhQKxA58pVqtqru7Wy9evNCGDRs0ODioTCYT65qxnowjduBLIQQdPXpU+XxemUxGz54908aNG2NfN0ri57VSqaT29naNjo7GvRTwxxgaGtK2bdsSWSuR0KXPsTc2NkqSmpubVSgUYt9dAVaTc+fO6eLFi1q7dq3m5+eV5CUsif2Ovhg1u/Fw1N/fr4sXL6quri72E2/fkvgFMxyzw83du3fV29urKIp069YtdXZ2Jj9ESNDictPT06G5uTlI4sbN5nb16tUVLSQlsWN0SYqiaOm4hGP2eC1/r5N4HFYaHBzUgQMHVKlUJOmL9zXp9zm1a905Zsff7PXr1zp06JAqlYpOnDiR9jjp/6eW5cfsuVyO2PHHe/v2rfbv36/Z2VkdOXJE165dS3uk5H5ek1buriz+XSqVlMvlNDY2pqamJhWLRXbjfxG77umYnJzUjh07NDk5qY6ODj148ED19fXf3faTkvo3uvR5N75YLKqpqUljY2N8s+OPVCqVtGvXLk1OTqqtrU0DAwOqr69PeyxJqyR0aWXsXV1daY8E/JCuri5NTExo69atyufzamhoSHukJati1325Uqmkrq4u9fX1afPmzUmN9teJouinH8uu+8958+aNenp69PDhwxWHnmnvuq+60IG/Udrb/qrZdQcQH0IHDBA6YIDQAQOEDhggdMAAoQMGCB0wkGrov3L1FoB/j290wECqoXP5K5AMvtEBA4QOGCB0wAChAwYIHTBA6IABQgcMEDpggNABA4QOGCB0wAChAwYIHTBA6IABQgcMEDpggNABA4QOGCB0wAChAwYIHTBA6IABQgcMEDpggNABA4QOGCB0wAChAwYIHTBA6IABQgcMEDpggNABA4QOGCB0wAChAwYIHTBA6IABQgcMEDpggNABA4QOGCB0wAChAwYIHTBA6IABQgcMEDpggNABA4QOGCB0wAChAwYIHTBA6IABQgcMEDpggNABA4QOGCB0wAChAwYIHTBA6IABQgcMEDpggNABA4QOGCB0wAChAwYIHTBA6IABQgcMEDpggNABA4QOGCB0wAChAwYIHTBA6IABQgcMEDpggNABA4QOGCB0wAChAwYIHTBA6IABQgcMEDpggNABA4QOGCB0wAChAwYIHTBA6IABQgcMEDpggNABA4QOGCB0wAChAwYIHTBA6IABQgcMEDpggNABA4QOGCB0wAChAwYIHTBA6IABQgcMEDpggNABA4QOGCB0wAChAwYIHTBA6IABQgcMEDpggNABA4QOGCB0wAChAwYIHTBA6IABQgcMEDpggNABA4QOGCB0wAChAwYIHTBA6IABQgcMEDpggNABA4QOGCB0wAChAwYIHTBA6IABQgcMEDpggNABA4QOGCB0wAChAwYIHTBA6IABQgcMEDpggNABA4QOGCB0wAChAwYIHTBA6IABQgcMEDpggNABA4QOGCB0wAChAwYIHTBA6IABQgcMEDpggNABA4QOGCB0wAChAwYIHTBA6IABQgcMEDpggNABA4QOGCB0wAChAwYIHTBA6IABQgcMEDpggNABA4QOGCB0wAChAwYIHTBA6IABQgcMEDpggNABA4QOGCB0wAChAwYIHTBA6IABQgcMEDrwm4yMjGjXrl0qlUppj7LCqgu9VCppz549evfuXdqjAD/k9OnTev78uTo6OlQul9Me5wurKvTZ2Vnt3btXhUJBx48fT3sc4IcMDAwom81qaGhI3d3dqtVqaY+0ZNWEXi6XtX//fo2MjGjjxo26d+9e2iMBPySTyejJkyfKZDLK5/M6c+ZM2iMtWRWhV6tVHTp0SK9evVImk9Hg4KA2bNiQ9ljAD8tms3r06JHWrVunK1eu6Pr162mPJGkVhF6r1XTkyBE9ffpU69evV7FYVDabTXss4Ke1tLToxo0biqJIJ0+eVD6fT3skRSGEkNhiUaTly0VRpGPHjunmzZtqaGhQsVjU9u3bkxoHiNXly5d19uxZNTQ0qFwur9j2E0wv/dAlqb6+Xo8fP1Z7e3tSowCJ6OnpWdp9Hx8fX9pbTTp0hQQtX+7ChQtBEjduNrdsNhump6eXWqjVauHjx4/JtJfIKouL6fNy/f39QVKIoijcvn07yRGAxM3NzYWWlpYgKbS0tIS5ubmlFpKSeOh37twJURQFSaGvry/J5YHUTE9Ph2w2GySFw4cPJx56YsfotVpNa9asWfr7/PnzOnfuXBJLA6vCxMSEWltbly6RTSg9SQmejCsWi5xsA76SVOxr/v9dft3Q0JA6Ozu/+Lc4XuDiWfwkPynxd4pzW1p87rq6OuXz+RVtxCH2C2bGxsa0b98+lctlHT58WJVKRdL/Xuzvsvh81Wr1tz4vPC1uR3Ftp5cuXVKtVlN3d7eGhoZ+6xrfFOcJgPHx8dDY2Bgkhb1794b5+fkQQgjVavWLnx1+xfLnqVarv2NsIIQQ/3Z64sSJIClkMpkwPj7+O0b+/vpxPfH79+/Dpk2bgqTQ2toa5ubmVtxneHj4p9/I5Y+L+fMK5uLaTj99+hQ6OztX/MYeh9gKaWtrC5LCli1bwocPH757v0qlEl68ePHNCwxmZmbCwsJCmJmZ+e5FCJVKJa6XACyJaztd/ht7LpeLbf7YQn/79m3I5XL/+lNqYWEhTE1NhUKh8I9XFxUKhTA1NRUWFhbiGh34rji20+np6bB79+4wMjIS29yJXusOIB3/BQJ0kjvRdZAsAAAAAElFTkSuQmCC',
    "Squared - Blank": 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6CAYAAACI7Fo9AAAACXBIWXMAAC4jAAAuIwF4pT92AAAEZ0lEQVR4nO3b3WrcRgCA0ZGbQgm96fs/ZKH0hzSx1YvdbZ2twWliSVN954AxMsaaBX07M9J6Wdd1HcCpPRw9AGB7QoeAw0NfluXoIcCmZrjGDw8d2J7QIUDosKOjHnItez5em2GvArPYM/p3u53p6v7FLcty2Lsc7OGla3zvSc/SHQKEDgG7L92fuy1f7N05u6O3qJvejPuSgO3PKTi6hU1n9NduvJnJKbm/9vec5OzRYWMzrFqFDhubYeUqdAgQOgQIHQKEDgFChwChQ4DQIUDoECB0CBA6BAgdAoQOAYeGPsOH/aHAjA4Bh4Y+w//pQoEZHQKEDgFChwChQ4DQIUDoECB0CBA6BAgdAoQOAUKHAKFDgNAhQOgQIHQIEDoECB0ChA4BQocAoUOA0CFA6BAgdAgQOgQIHQKEDgFChwChQ4DQIUDoECB0CBA6BAgdAoQOAUKHAKFDgNAhQOgQIHQIEDoECB0ChA4BQocAoUOA0CFA6BAgdAgQOgQIHQKEDgFChwChQ4DQIUDoECB0CBA6BAgdAoQOAUKHAKFDgNAhQOgQIHQIEDoECB0ChA4BQocAoUOA0CFA6BAgdAgQOgQIHQKEDgFChwChQ4DQIUDoECB0CBA6BAgdAoQOAUKHAKFDgNAhQOgQIHQIEDoECB0ChA4BQocAoUOA0CFA6BAgdAgQOgQIHQKEDgFChwChQ4DQIUDoECB0CBA6BAgdAoQOAUKHAKFDgNAhQOgQIHQIEDoECB0ChA4BQocAoUOA0CFA6BAgdAgQOgQIHQKEDgFChwChQ4DQIUDoECB0CBA6BAgdAoQOAUKHAKFDgNAhQOgQIHQIEDoECB0ChA4BQocAoUOA0CFA6BAgdAgQOgQIHQKEDgFChwChQ4DQIUDoECB0CBA6BAgdAoQOAUKHAKFDgNAhQOgQIHQIEDoECB0ChA4BQocAoUOA0CFA6BAgdAgQOgQIHQKEDgFChwChQ4DQIUDoECB0CBA6BAgdAoQOAUKHAKFDgNAhQOgQIHQIEDoECB0ChA4BQocAoUOA0CFA6BAgdAgQOgQIHQKEDgFChwChQ8DsoT8dPQA4g1lDX8cYvx89CDiLGUN/HGMsY4z3Y87xwf/OTCHdlunfHToKOKGZQp9pLHAqs8T1NC77cmADM4S+jss4lmfHwBuaIfTfrt9ve/Rb8I9jjD+H8OGbvTt6AOPyZnOb1W8er8duzMEbmCH093fH6/VreeF3ga+wrOu62dJ4WV5v9YXTi5zT+coW3u78W4b+r5Mty1jX9ecxxk9jjPHw8LDpi4OZPL/Wry3sdu4jQn/1Z3AmM1z3R911//jKMfCGjgr9++v3P+6OgQ3svnQHLvZcum/9eO2XcZmtfxhjjHVdH8fl2fjfxdujc3YzXONbh/7j+Hx7MMNze8jZYo/+aVw+2bbV3wf+oy1m2NvffBqX0D+Nzz/maqMOO9v1Ztz45+OtZnrY0V7B3d5Mlh3PCVztFd2HMcavO50LuPMX9z6YzbB2aHwAAAAASUVORK5CYII=',
    "Squared - Springs & Tabs": 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6CAYAAACI7Fo9AAAACXBIWXMAAC4jAAAuIwF4pT92AAAGiUlEQVR4nO3dwU4bSR7H8X8bjGC0l32OvP8tT5BTLrxCIk6I1e7CYuzeA5gJjIFMUt3V8u/zkSLGSabsSP11VberYRjHcSzgqK16vwBgekKHAN1DH4ah90uASS3hGO8eOjA9oUMAocOMen3INcz58doSzlVgKeaM/nS2Z3ry+h83DEO3dzmYw6FjfO5Jz9IdAggdAsy+dP/Rfvni3J1j1/sUddKLcT8TsPNzEvRuYdIZ/aMLb2Zykrw+9uec5GY5R99ut6Im1hJWrZOfowucdEtoYLIZfbPZvPgHLuFdDVJNMqNvNps6OzurKoHDEkwyo4sclqV56F+/fq0qkcOSNP0c/e7uri4uLqrqcOiHPl7zhkCC3sd+0xn9y5cvVWU2h6VpNqOP41ir1er5vw8+mRmdUL2P/WYz+tXVVVWZzWGJmoV+eXnZaiigsWZL9/3mmPeG6718gV56H/vuR4cATUO/vr5uORzQSNOl+263e3cD/+vlymq1qt1u1+LpYdGOaul+c3PTcjigERfjYAa9j30X4yBAs9A/f/7caiigsWahf/r0qdVQQGP2usMMeh/7zWb0JXxfLOCwphfjbm9vq0r0sDRNQz8/P285HNBI84/X9ucdZnVYjkk+R7+/v68qscNSTBL6er1+Ebvgoa/Jdsat1+uDP2fNTSwwv8m3wI7jWA8PD8+PhQ7zm2Wv+8nJyfPsfnra9UeyQyQ3tUAAoUMAoUMAoUMAoUMAoUMAoUMAoUMAoUMA29SgkSXfvCV0aOi975fYk6U7BBA6BBA6BBA6BBA6BBA6BBA6BBA6BBA6BBA6BBA6BBA6BHBTCzTU++aVtwgdGnnrzrWq/m8Alu4QQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQ4LT3C4BjMQxD75fwJqFDQ+M4Hvz93m8Clu4QQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQQOgQwE0t0FDvm1feInRo5K0716r6vwFYukMAoUMAoUMAoUMAoUMAoUMAoUMAoUOAWULfbrfPGwbe21QATGPynXGvdwSN49h9lxCkmWxG32w2L4Lez+SrlbMFmNskM/pms6mzs7OqslSHJZhkehU5LEvz0F10g+VpGvrd3V3L4YBGmoZ+cXFRVWZzWJpmoYsblqtZ6FdXV1UleFiiZqFfXl62GgpobBgbTcE/c7V9GIYXf/76MRyr3se+bWoQoGno19fXLYcDGmm6dN/tdu/esNJ7+QK99D72m87oNzc3LYcDGmka+rdv31oOBzTiqjvMoPex76o7BGgW+vfv31sNBTTWbOk+juPzd495a8hfWL7syqqDI3A0S/fG3wdurKr/thwQkjWdLW9vb6vqt6PfVtVQVX+U2RyaaBrS+fn57/zvu6evJw1eCvCD5jPm/rzjF2Z1szdMZJK47u/vq+pvxb6rx/NyYAKThL5er1/E/kHw49PrGH54DDQ02XJ5vV7/5eOEN/zn6ev+HH3/F7dVdV/Ch982+XnxOI718PDw0WvYz+p726fHZ/Vn+MAvmuUC2MnJyXubA/6olzGPT78EDo002xl3cPCfuBh34OlFztH5xRbaPf+Uof/lyR63/V1X1T+rHn/gorvXSNFzC2yP0D/8PTgmSzjue21S2XzwGGioV+jrp6+3rx4DE5h96Q48mnPpfjrx+P+qx9n6vKpqHMdtPd608ly8c3SO3RKO8alD/0e9PD2Y+vmAA6Y4R3+ox51tU40P/E1TzLD7MfffBuqhXm5zdaIOM5v1Ylz9ub3VTA8zmiu4/ZvJMONzAk/miu5/VfXvmZ4LeOX/+bIGZlO1gOAAAAAASUVORK5CYII=',
    "Squared - Springs, Tabs & Spreader Bar": 'data:image/png;base64,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',
    "Squared - Blank & Spreader Bar": 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6CAYAAACI7Fo9AAAACXBIWXMAAC4jAAAuIwF4pT92AAAEg0lEQVR4nO3b3WokRQCA0eoYQRZvfP+HFMQf1E3ai5nR3RiIrumucr5zIIQOIV0D/U1VdU+2fd/3Ady1h9kDAI4ndAiYHvq2bbOHAIda4RqfHjpwPKFDgNDhRLMecm1nPl5bYa8Cqzgz+sfTznT18sVt2zbtXQ7O8No1fvakZ+kOAUKHgNOX7p+6LV/s3bl3s7eoh96M+ycB259TMLuFQ2f0t268mckpeXntnznJ2aPDwVZYtQodDrbCylXoECB0CBA6BAgdAoQOAUKHAKFDgNAhQOgQIHQIEDoECB0Cpoa+wof9ocCMDgFTQ1/h/3ShwIwOAUKHAKFDgNAhQOgQIHQIEDoECB0ChA4BQocAoUOA0CFA6BAgdAgQOgQIHQKEDgFChwChQ4DQIUDoECB0CBA6BAgdAoQOAUKHAKFDgNAhQOgQIHQIEDoECB0ChA4BQocAoUOA0CFA6BAgdAgQOgQIHQKEDgFChwChQ4DQIUDoECB0CBA6BAgdAoQOAUKHAKFDgNAhQOgQIHQIEDoECB0ChA4BQocAoUOA0CFA6BAgdAgQOgQIHQKEDgFChwChQ4DQIUDoECB0CBA6BAgdAoQOAUKHAKFDgNAhQOgQIHQIEDoECB0ChA4BQocAoUOA0CFA6BAgdAgQOgQIHQKEDgFChwChQ4DQIUDoEPA4ewDbts0eAty96aHv+z57CHC42ROapTsETJ/RZ7/TQcH00C3dKZg9oVm6Q4DQIUDoECB0CBA6BAgdAoQOAUKHAKFDgNAhQOgQIHQIEDoECB0ChA4BQocAoUOA0CFA6BAgdAgQOgQIHQKEDgFChwChQ4DQIUDoECB0CBA6BAgdAoQOAUKHAKFDgNAhQOgQIHQIEDoECB0ChA4BQocAoUOA0CFA6BAgdAgQOgQIHQKEDgFChwChQ4DQIUDoECB0CBA6BAgdAoQOAUKHAKFDgNAhQOgQIHQIEDoECB0ChA4BQocAoUOA0CFA6BAgdAgQOgQIHQKEDgFChwChQ4DQIUDoECB0CBA6BAgdAoQOAUKHAKFDgNAhQOgQIHQIEDoECB0ChA4BQocAoUOA0CFA6BAgdAgQOgQIHQKEDgFChwChQ4DQIWD10J9nDwDuwaqh72OMn2cPAu7FiqE/jTG2McaHseb44H9npZBuy/Svpo4C7tBKoa80Frgrq8T1PC77cuAAK4S+j8s4tk+OgXe0Qug/Xb/f9ui34J/GGL8N4cN/9jh7AOPyZnOb1W+ersduzME7WCH0Dy+O9+vX9srvAl9g2/f9sKXxtr3d6iunFzl35wtbeL/zHxn63062bWPf9+/HGN+NMcbDw8OhLw5W8um1fm3htHPPCP3Nn8E9WeG6n3XX/fc3joF3NCv0r6/ff3lxDBzg9KU7cHHm0v3ox2s/jMts/c0YY+z7/jQuz8b/LN4enXu3wjV+dOjfjs+3Bys8t4ecI/boH8flk21H/X3gXzpihr39zedxCf3j+PxjrjbqcLJTb8aNvz7eaqaHE50V3O3NZDvxnMDVWdH9Osb48aRzAS/8AX67ntvqBAnjAAAAAElFTkSuQmCC',
    "Squared - Narrow - Springs & Tabs": 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6CAYAAACI7Fo9AAAACXBIWXMAAC4jAAAuIwF4pT92AAAFWElEQVR4nO3czW7TWByH4b87DWIQm1l11xtgw0Vw2Wy4AlZcRFcTjTSTUUo4s0jMlLRQKLF9yO95pKpNSWOnnNc+/lCH1lor4KxdLL0CwPSEDgEWD30YhqVXASbVwxhfPHRgekKHAEKHGS11kWuY8/JaD8cq0Is5o7+cbUkHx29uGIbFtnIwh4fG+Nw7PVN3CCB0CDD71P2ucfri2J1zt/Qh6qQn474nYMfn03jqwFp6QJ6rpVuYdI/+2Ik3e3KSHI/9OTeojtFhYj3MkIQOE+th5ip0CCB0CLDo5TWm1cOUkT4I/Uz1cAKIfpi6QwChQwChQwChQwChQwChQwChQwChQ4BFQ3fnFszDHh0CLBq62zRhHvboEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEEDoEKD30D8tvQJwDnoNvVXVP0uvBJyLHkPfVdVQVS+qz/WDX05PIY3T9N8WXQs4Qz2F3tO6wFnpJa5PtT8uBybQQ+it9usx3HkMnFAPof99+Dweo4/B76pqW8KHn3a59ArUfmMz7tVHu8NjJ+bgBHoI/cXR43b4GB54LvAEQ2ttsqnxMDze6gOLFzln54ktnG75U4Z+b2HDUK21P6vqj6qqi4uLSd8c9OTuWD+0MNuylwj90e/BOelh3C911v32kcfACS0V+urweVNVtV6vV994LpzcbrdbehVmNfvUHdibc+o+9eW1v2q/935eVdVa29X+2vjn4u/GP8UbH1/feQAeMuX4mHps/4ipp+4vq+r32oc91H7Dcm+3vt1uq+r0e/zx9cbXh2NTjr3r6+tuDhGmmLp/rH3M33VX23j28fb2tp49e/b5+z+zWnf/07bbba1WTgHwdVOPvR6uLE2xR7+sfeTjvesfD1/v6hv3ra9Wq2qt1fv376tq/wv70a3s8c+01kTOoxLG3pRT9/G1L+vL+9a/+Dtwx1u6169f12azqXfv3lXV/7/A8WO9Xldrrdbr9b1/G202m8W3oPx6php7PYzFuc66P+m21tZa3dzc1IcPH+rNmzdffd7bt2/r1atXdXV15cw+J3FuY2+u0P+t/RT+5QzLAo78B5pBMZrQpAGuAAAAAElFTkSuQmCC'
}

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const generatePDF = async (screenOrders, orderDetails, customerName, customerPhone, estimatedPickup, employeeName, comment, screenClipOrder) => {

  let emptyOrder = { id: '\n\n', frameColor: '', frameType: '', frameSize: '', screenType: '', width: '', widthFraction: '', height: '', heightFraction: '', quantity: '' };
  let paddedScreenOrders = [...screenOrders];

  // Fill up to 4 rows
  while (paddedScreenOrders.length < 4) {
      paddedScreenOrders.push(emptyOrder);
  }

  let tableBody = [
      [
          { text: '#:', alignment: 'center', bold: true },
          { text: 'Type:', bold: true },
          { text: 'Screen:', bold: true },
          { text: 'Dimensions:\n Width X Height', bold: true },
          { text: 'QTY:', alignment: 'center', bold: true }
      ],
  ];

  const getPullTabItem = (order) => {
      const pullTab = pullTabPricing.find(pt => pt.label === order.pullTab);
      if (pullTab) {
          const qty = order.pullTabQty * order.quantity;
          const extendedPrice = pullTab.price * qty;
          return {
              sku: pullTab.sku,
              qty,
              description: pullTab.description,
              price: pullTab.price,
              extendedPrice
          };
      }
      return null;
  };

  let pullTabItemsMap = new Map();
  for (let order of screenOrders) {
      const pullTabItem = getPullTabItem(order);
      if (pullTabItem) {
          const existingItem = pullTabItemsMap.get(pullTabItem.description);
          if (existingItem) {
              existingItem.qty += pullTabItem.qty;
              existingItem.extendedPrice += pullTabItem.extendedPrice;
          } else {
              pullTabItemsMap.set(pullTabItem.description, pullTabItem);
          }
      }
  }

  // Convert Map to array
  let pullTabItems = Array.from(pullTabItemsMap.values());

  const getSpringItem = (order) => {
      const springItem = springPricing[0];
      if (springItem) {
          const qty = order.springQty * order.quantity;
          const extendedPrice = springItem.price * qty;
          return {
              sku: springItem.sku,
              qty,
              description: springItem.description,
              unitPrice: springItem.price,
              extendedPrice
          };
      }
      return null;
  };

  let springItems = [];
  let totalSpringQty = 0;

  for (let order of screenOrders) {
      const springItem = getSpringItem(order);
      if (springItem) {
          // Check if the item is already in the array and update qty and extendedPrice if found
          const existingItem = springItems.find(item => item.sku === springItem.sku);
          if (existingItem) {
              existingItem.qty += springItem.qty;
              existingItem.extendedPrice += springItem.extendedPrice;
          } else {
              springItems.push(springItem);
          }
          totalSpringQty += springItem.qty;
      }
  }

  const getSpreaderBarItem = (orders, spreaderBarPricing) => {
      let totalWidth = 0;

      // Iterate through the orders to calculate total width
      for (let order of orders) {
          if (order.spreaderBar) {
              const smallestDimension = Math.min(order.width, order.height);
              totalWidth += smallestDimension * order.quantity;
          }
      }

      // Calculate the spreaderBarQty
      const spreaderBarQty = Math.ceil(totalWidth / 144);

      if (spreaderBarQty > 0) {
          // Assuming the frameColor of the first order with spreaderBar is representative for all orders
          const frameColor = orders.find(order => order.spreaderBar)?.frameColor;
          const spreaderBar = spreaderBarPricing[frameColor];
          return {
              sku: spreaderBar.sku,
              qty: spreaderBarQty,
              description: frameColor + ' Spreader Bars',
              unitPrice: spreaderBar.price,
              extendedPrice: spreaderBar.price * spreaderBarQty
          };
      }
      return null;
  };

  // Usage
  const spreaderBarItem = getSpreaderBarItem(screenOrders, spreaderBarPricing);
  const spreaderBarArray = spreaderBarItem ? [spreaderBarItem] : [];


  for (let order of paddedScreenOrders) {
      let row = [];
      console.log(order);
      row.push({ text: order.id.toString() || ' ', alignment: 'center' });

      let frameText = (order.frameColor + " " + order.frameType);
      row.push(frameText || ' ');

      row.push(order.screenType || ' ');

      let dimensionsText = (order.width && order.width !== '' && order.widthFraction && order.widthFraction !== '' && order.height && order.height !== '' && order.heightFraction && order.heightFraction !== '') ? `${order.width} - ${order.widthFraction}" X ${order.height} - ${order.heightFraction}"` : '';
      row.push(dimensionsText || ' ');

      row.push({ text: order.quantity.toString() || ' ', alignment: 'center' });
      tableBody.push(row);
  }

  // Assuming orderDetails is an array of objects with keys: sku, qty, unitPrice
  // And extendedPrice is computed as qty * unitPrice
  // Merge screenDetails with orderDetails for pricing table
  let pricingOrdersForPdf = [...orderDetails, ...pullTabItems, ...springItems, ...spreaderBarArray, ...screenClipOrder].map(order => ({
      sku: order.sku || '',
      qty: order.qty || '',
      description: order.description || 'Screen Kit',
      unitPrice: order.unitPrice || order.price || '',
      extendedPrice: (order.unitPrice * order.qty) || (order.price * order.qty) || ''
  }));


  // Ensure there are at least 6 rows
  while (pricingOrdersForPdf.length < 6) {
      pricingOrdersForPdf.push({ sku: '', qty: '', description: '', unitPrice: '', extendedPrice: '' });
  }

  let tablePricing = [
      [
          { text: 'SKU', bold: true, alignment: 'center' },
          { text: 'QTY', bold: true, alignment: 'center' },
          { text: 'DESCRIPTION', bold: true, alignment: 'center' },
          { text: 'UNIT PRICE', bold: true, alignment: 'center' },
          { text: 'EXTENDED PRICE', bold: true, alignment: 'center' }
      ],
  ];

  // For tablePricing
  for (let order of pricingOrdersForPdf) {
      let row = [];
      row.push({ text: (order.sku ? order.sku.toString() : ' '), alignment: 'center' });
      row.push({ text: (order.qty ? order.qty.toString() : ' '), alignment: 'center' });
      row.push({ text: order.description || ' ', alignment: 'center' });
      row.push({ text: (order.unitPrice ? order.unitPrice.toFixed(2).toString() : ' '), alignment: 'center' });
      row.push({ text: (order.extendedPrice ? order.extendedPrice.toFixed(2).toString() : ' '), alignment: 'center' });
      tablePricing.push(row);
  }

  let userInfo = {
      name: customerName,
      phone_number: customerPhone,
      alt_phone_number: '',
      employee_name: employeeName,
      purchase_date: `${month}/${day}/${year}`,
      pickup_date: estimatedPickup
  }

  comment = comment + '\n\n';
  console.log(screenOrders);

  // Calculate the total price without tax
  const estimatedTotal = pricingOrdersForPdf.reduce((total, order) => {
    const extendedPrice = parseFloat(order.extendedPrice) || 0; // Ensure it's a number
    return total + extendedPrice;
  }, 0);

  // Calculate the total price with Hawaii tax
  const hawaiiTax = hawaiiTaxRate * estimatedTotal;
  const totalWithTax = estimatedTotal + hawaiiTax;

  console.log(estimatedTotal);
  console.log(totalWithTax);

    let docDefinition = {

        content: [
            {
                columns:[
                    {text: 'Screen Order Form - Kit', bold: true, fontSize: 24, alignment: 'center', margin: [0, 0, 0, 5]},
                    {text: 'Invoice #: ____________', fontSize: 19, italics: true, alignment: 'right'}
                ]
            },
            {
                columns: [
                    // Main content
                    [
                        {
                            style: 'tableExample',
                            table: {
                                widths: [150, 110, '*'],
                                body: [
                                    [
                                        { text: [{ text: 'Customer:', style: 'subheader' }, { text:`\n${userInfo.name}`}], alignment: 'left'},
                                        { text: [{ text: 'Phone #:', style: 'subheader' }, { text:`\n${userInfo.phone_number}`}], alignment: 'left'},
                                        { text: [{ text: 'Alt Phone #:', style: 'subheader' }, { text:`\n${userInfo.alt_phone_number}`}], alignment: 'left'}
                                    ],
                                    [
                                        { text: [{ text: 'Employee:', style: 'subheader' }, { text:`\n${userInfo.employee_name}`}], alignment: 'left'},
                                        { text: [{ text: 'Purchase Date:', style: 'subheader' }, { text:`\n${userInfo.purchase_date}`}], alignment: 'left'},
                                        { text: [{ text: 'Estimated Pick-up:', style: 'subheader' }, { text:`\n${userInfo.pickup_date}`}], alignment: 'left'}
                                    ]
                                ]
                            }
                        },
                        {
                            style: 'tableExample',
                            table: {
                                widths: [15, '*', '*', 130, 30],
                                body: tableBody
                            }
                        },
                        {
                            style: 'tableExample',
                            table: {
                                widths: ['*'],
                                body: [
                                    [{ text: 'Comments:\n', bold: true, fontSize: 13, alignment: 'left', border: [true, true, true, false] }],
                                    [{ text: comment, alignment: 'left', border: [true, false, true, true] }]
                                ]
                            },
                            layout: {
                                hLineWidth: function() { return 1; },
                                vLineWidth: function() { return 1; },
                            }
                        },
                        {
                            style: 'tableExample',
                            table: {
                                widths: [50, 25, 120, 65, 95],
                                body: tablePricing
                            }
                        },
                        {
                          style: 'tableExample',
                          table: {
                              widths: ['*', 90, 70],
                              body: [
                                  [
                                      { text: '', border: [false, false, false, false] }, // Empty cell without borders
                                      { text: 'Estimated Total:', alignment: 'right', bold: true },
                                      { text: `$${estimatedTotal.toFixed(2)}`, alignment: 'center', bold: true }
                                  ],
                                  [
                                      { text: '', border: [false, false, false, false] }, // Empty cell without borders
                                      { text: 'Including Tax:', alignment: 'right', bold: true },
                                      { text: `$${totalWithTax.toFixed(2)}`, alignment: 'center', bold: true }
                                  ]
                              ],
                              layout: {
                                  hLineWidth: function (i, node) {
                                      return (i === 0 || i === node.table.body.length) ? 2 : 1; // Add thicker line above and below the table
                                  },
                                  vLineWidth: function (i, node) {
                                      return 0;
                                  },
                                  hLineColor: function (i, node) {
                                      return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                                  }
                              }
                          }
                      },
                        { text: 'My signature above signifies that I have read & understand the above order & concur that the measurements & details of this order are correct.', alignment:'center' },
                        { text: 'ALL SALES ARE FINAL.', alignment: 'center', bold: true },
                        { text: 'A Sales Associate will contact the number(s) above when my order is completed.', alignment: 'center', bold: true },
                        {
                            style: 'tableExample',
                            table: {
                                widths: ['*', 90],
                                body: [
                                    [
                                        { text: [{ text: 'Customer Signature:', style: 'subheader' }, { text:`\n\n`}], alignment: 'left'},
                                        { text: [{ text: 'Date:', style: 'subheader' }, { text:`\n\n`}], alignment: 'left'},
                                    ],
                                    [
                                        { text: [{ text: 'Merchandise Recieved By:', style: 'subheader' }, { text:`\n\n`}], alignment: 'left'},
                                        { text: [{ text: 'Date:', style: 'subheader' }, { text:`\n\n`}], alignment: 'left'},
                                    ]
                                ]
                            }

                        }
                    ],
                   // Image column
                    [
                        {
                        table: {
                            widths: [150],
                            body: [].concat(
                                ...screenOrders.map((order) => {
                                    return [
                                    [
                                        {
                                            stack: [
                                                { text: `Screen No. ${order.id}`, alignment: 'center' },
                                                { image: configToImgMap[order.config], width: 150, alignment: 'center' },
                                                { text: 'W: ' + order.width + ' - ' + order.widthFraction + '" X ' + 'H: ' + order.height + ' - ' + order.heightFraction + '"', alignment: 'center', margin: [0, 0, 0, 4], fontSize: 9 }
                                            ],
                                            alignment: 'center'
                                        },
                                    ],
                                    ];
                                })
                            ),
                        },
                        layout: 'noBorders',
                        },
                    ],
                ]
            }
        ],
        styles: {
            subheader: {
                fontSize: 13,
                bold: true,
                margin: [0, 0, 0, 5]
            },
            tableExample: {
                margin: [0, 0, 0, 15]
            },
            tableHeader: {
                bold: true,
                fontSize: 13,
                color: 'black'
            },
            spacingStyle: {
                margin: [0, 10, 0, 0]
            }
        },
        defaultStyle: {
            // alignment: 'justify'
        }
    };

    pdfMake.createPdf(docDefinition).download();
};
