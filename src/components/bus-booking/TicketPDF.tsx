"use client";

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Standard styling for the PDF
const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#FFFFFF',
        fontFamily: 'Helvetica',
    },
    header: {
        backgroundColor: '#333333',
        padding: 20,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    reservationNo: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '900',
        marginTop: 4,
    },
    status: {
        color: '#FF6B00',
        fontSize: 16,
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        borderRadius: 10,
    },
    routeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        marginBottom: 20,
    },
    routeBox: {
        flex: 1,
    },
    label: {
        color: '#777777',
        fontSize: 8,
        textTransform: 'uppercase',
        marginBottom: 5,
    },
    districtName: {
        color: '#333333',
        fontSize: 20,
        fontWeight: 'bold',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20,
    },
    gridItem: {
        width: '50%',
        marginBottom: 15,
    },
    value: {
        color: '#333333',
        fontSize: 14,
        fontWeight: 'bold',
    },
    orangeValue: {
        color: '#FF6B00',
        fontSize: 14,
        fontWeight: 'bold',
    },
    footer: {
        marginTop: 30,
        padding: 20,
        backgroundColor: '#F8F8F8',
        borderRadius: 10,
        alignItems: 'center',
    },
    footerText: {
        color: '#777777',
        fontSize: 9,
        textAlign: 'center',
        lineHeight: 1.5,
    }
});

interface TicketPDFProps {
    details: {
        name: string;
        bookingId: string;
        busName: string;
        seats: string[];
        from: string;
        to: string;
        total: number;
    };
}

export const TicketPDF = ({ details }: TicketPDFProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerText}>Reservation No</Text>
                    <Text style={styles.reservationNo}>{details.bookingId}</Text>
                </View>
                <View style={{ textAlign: 'right' }}>
                    <Text style={styles.headerText}>Status</Text>
                    <Text style={styles.status}>CONFIRMED</Text>
                </View>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                <View style={styles.routeContainer}>
                    <View style={styles.routeBox}>
                        <Text style={styles.label}>Origin District</Text>
                        <Text style={styles.districtName}>{details.from}</Text>
                    </View>
                    <View style={{ paddingHorizontal: 20 }}>
                        <Text style={{ color: '#FF6B00', fontSize: 12 }}>{">>>"}</Text>
                    </View>
                    <View style={[styles.routeBox, { textAlign: 'right' }]}>
                        <Text style={styles.label}>Dest District</Text>
                        <Text style={styles.districtName}>{details.to}</Text>
                    </View>
                </View>

                <View style={styles.grid}>
                    <View style={styles.gridItem}>
                        <Text style={styles.label}>Passenger Name</Text>
                        <Text style={styles.value}>{details.name}</Text>
                    </View>
                    <View style={[styles.gridItem, { textAlign: 'right' }]}>
                        <Text style={styles.label}>Bus Operator</Text>
                        <Text style={styles.value}>{details.busName}</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.label}>Seats</Text>
                        <Text style={styles.orangeValue}>{details.seats.join(', ')}</Text>
                    </View>
                    <View style={[styles.gridItem, { textAlign: 'right' }]}>
                        <Text style={styles.label}>Total Fare Paid</Text>
                        <Text style={styles.value}>INR {details.total}</Text>
                    </View>
                </View>
            </View>

            {/* Instructions */}
            <View style={styles.footer}>
                <Text style={[styles.label, { color: '#333333', marginBottom: 10 }]}>Boarding Instructions</Text>
                <Text style={styles.footerText}>
                    Please present this digital or printed ticket at the boarding point.
                    Carry a valid Government ID proof (Aadhar/Voter ID/DL).
                    Reach the terminal at least 15 minutes before the departure time.
                    In case of emergency, contact +91 99999 88888.
                </Text>
            </View>

            <Text style={{ marginTop: 20, textAlign: 'center', color: '#777777', fontSize: 8 }}>
                Generated by Magic Bus &bull; Tamil Nadu State Transport Partner
            </Text>
        </Page>
    </Document>
);
