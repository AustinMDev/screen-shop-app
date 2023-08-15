import React, { useState, useEffect } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import configImg0 from '/assets/screenConfigImgs/screen-template-blank.png';

import configImg1 from '/assets/screenConfigImgs/screen-template-corners-angle.png';
import configImg2 from '/assets/screenConfigImgs/screen-template-corners-angle-pulltabs-springs.png';
import configImg3 from '/assets/screenConfigImgs/screen-template-corners-angle-pulltabs-springs-rod.png';
import configImg4 from '/assets/screenConfigImgs/screen-template-corners-angle-rod.png';
import configImg5 from '/assets/screenConfigImgs/screen-template-corners-angle-pulltabs-springs-narrow.png';

import configImg6 from '/assets/screenConfigImgs/screen-template-corners-box.png';
import configImg7 from '/assets/screenConfigImgs/screen-template-corners-box-pulltabs-springs.png';
import configImg8 from '/assets/screenConfigImgs/screen-template-corners-box-pulltabs-springs-rod.png';
import configImg9 from '/assets/screenConfigImgs/screen-template-corners-box-rod.png';
import configImg10 from '/assets/screenConfigImgs/screen-template-corners-box-pulltabs-springs-narrow.png';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const PDFMake: React.FC = () => {

    const [images, setImages] = useState({});

    useEffect(() => {
        const imgVars = [configImg0, configImg1, configImg2, configImg3, configImg4, configImg5, configImg6, configImg7, configImg8, configImg9, configImg10];
    
        const loadImage = async (url) => {
            const response = await fetch(url);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        };
    
        Promise.all(imgVars.map(loadImage))
            .then((base64Images) => {
                setImages((oldImages) => ({
                    ...oldImages,
                    configImg0: base64Images[0],
                    configImg1: base64Images[1],
                    configImg2: base64Images[2],
                    configImg3: base64Images[3],
                    configImg4: base64Images[4],
                    configImg5: base64Images[5],
                    configImg6: base64Images[6],
                    configImg7: base64Images[7],
                    configImg8: base64Images[8],
                    configImg9: base64Images[9],
                    configImg10: base64Images[10],
                }));
            });
    }, []);

    console.log(images);
    

    const generatePDF = () => {

        let name = "John Doe";
        let phone_number = "1234567890";
        let employee_name = "Employee";
        let purchase_date = "2023-06-14";
        let pickup_date = "2023-06-15";

        let screenOrders = [
            { screenId: 1, type: 'Bronze - Box - 5/16', screen: 'Fiberglass - Charcoal', dimensions: 'Length - Width', qty: 2 },
            // More screen orders...
        ];

        // Ensure there are at least 5 rows
        while (screenOrders.length < 4) {
            screenOrders.push({ screenId: '', type: '', screen: '', dimensions: '', qty: '' });
        }

        let tableBody = [
            [
                { text: '#:', alignment: 'center', bold: true },
                { text: 'Type:', bold: true },
                { text: 'Screen:', bold: true },
                { text: 'Dimensions:', bold: true },
                { text: 'QTY:', alignment: 'center', bold: true }
            ],
        ];

        for (let order of screenOrders) {
            let row = [];
            row.push({ text: order.screenId.toString() || ' ', alignment: 'center' });
            row.push(order.type || ' ');
            row.push(order.screen || ' ');
            row.push(order.dimensions || ' ');
            row.push({ text: order.qty.toString() || ' ', alignment: 'center' });
            tableBody.push(row);
        }

        let comments = ['First comment\n', 'Second comment\n', 'Third comment\n\n'];

        // Join comments with line breaks to create a multiline string
        let commentString = comments.join('\n');

        let pricingOrders = [
            { sku: 1, qty: 2, description: 'Item 1', unitPrice: 10.00, extendedPrice: 20.00 },
            // More pricing orders...
        ];

        // Ensure there are at least 10 rows
        while (pricingOrders.length < 10) {
            pricingOrders.push({ sku: '', qty: '', description: '', unitPrice: '', extendedPrice: '' });
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

        for (let order of pricingOrders) {
            let row = [];
            row.push({ text: order.sku.toString() || ' ', alignment: 'center' });
            row.push({ text: order.qty.toString() || ' ', alignment: 'center' });
            row.push({ text: order.description || ' ', alignment: 'center' });
            row.push({ text: order.unitPrice.toString() || ' ', alignment: 'center' });
            row.push({ text: order.extendedPrice.toString() || ' ', alignment: 'center' });
            tablePricing.push(row);
        }

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
                                            { text: [{ text: 'Customer:', style: 'subheader' }, { text:`\n${name}`}], alignment: 'left'}, 
                                            { text: [{ text: 'Phone #:', style: 'subheader' }, { text:`\n${phone_number}`}], alignment: 'left'}, 
                                            { text: [{ text: 'Alt Phone #:', style: 'subheader' }, { text:`\n${phone_number}`}], alignment: 'left'} 
                                        ],
                                        [
                                            { text: [{ text: 'Employee:', style: 'subheader' }, { text:`\n${employee_name}`}], alignment: 'left'}, 
                                            { text: [{ text: 'Purchase Date:', style: 'subheader' }, { text:`\n${purchase_date}`}], alignment: 'left'}, 
                                            { text: [{ text: 'Estimated Pick-up:', style: 'subheader' }, { text:`\n${pickup_date}`}], alignment: 'left'} 
                                        ]
                                    ]
                                }
                            },
                            {
                                style: 'tableExample',
                                table: {
                                    widths: [15, '*', '*', 80, 30],
                                    body: tableBody
                                }
                            },
                            {
                                style: 'tableExample',
                                table: {
                                    widths: ['*'],
                                    body: [
                                        [{ text: 'Comments:', bold: true, fontSize: 13, alignment: 'left', border: [true, true, true, false] }],
                                        [{ text: commentString, alignment: 'left', border: [true, false, true, true] }]
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
                                    body: [
                                        [{text: "Screen No. 1", alignment: 'center'}],
                                            [{image: images.configImg0, width: 135, alignment: 'center' }],
                                        [{text: "W:___ H:___", alignment: 'center', margin: [0, 0, 0, 9]}],

                                        [{text: "Screen No. 2", alignment: 'center'}],
                                            [{image: images.configImg1, width: 135, alignment: 'center' }],
                                        [{text: "W:___ H:___", alignment: 'center', margin: [0, 0, 0, 9]}],

                                        [{text: "Screen No. 3", alignment: 'center'}],
                                            [{image: images.configImg2, width: 135, alignment: 'center' }],
                                        [{text: "W:___ H:___", alignment: 'center', margin: [0, 0, 0, 9]}],

                                        [{text: "Screen No. 4", alignment: 'center'}],
                                            [{image: images.configImg3, width: 135, alignment: 'center' }],
                                        [{text: "W:___ H:___", alignment: 'center', margin: [0, 0, 0, 9]}],
                                    ]
                                },
                                layout: 'noBorders',
                            }
                        ]

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
                    margin: [0, 5, 0, 15]
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

        console.log(images);
        pdfMake.createPdf(docDefinition).download();
    };
    return (
        <div>
            <button onClick={generatePDF}>Generate PDF</button>
        </div>
    );
};

export default PDFMake;