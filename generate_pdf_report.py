#!/usr/bin/env python3
"""
Car Price Predictor - PDF Report Generator
Converts the technical documentation to a professional PDF format
"""

import os
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib.colors import HexColor, black, white, blue
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.pdfgen import canvas
from datetime import datetime

class PDFReportGenerator:
    def __init__(self, filename="Car_Price_Predictor_Technical_Report.pdf"):
        self.filename = filename
        self.doc = SimpleDocTemplate(filename, pagesize=A4, 
                                   rightMargin=72, leftMargin=72,
                                   topMargin=72, bottomMargin=18)
        self.styles = getSampleStyleSheet()
        self.story = []
        
        # Custom styles
        self.title_style = ParagraphStyle(
            'CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            alignment=TA_CENTER,
            textColor=HexColor('#2563eb')
        )
        
        self.heading_style = ParagraphStyle(
            'CustomHeading',
            parent=self.styles['Heading2'],
            fontSize=16,
            spaceAfter=12,
            spaceBefore=20,
            textColor=HexColor('#1e40af')
        )
        
        self.subheading_style = ParagraphStyle(
            'CustomSubHeading',
            parent=self.styles['Heading3'],
            fontSize=14,
            spaceAfter=8,
            spaceBefore=12,
            textColor=HexColor('#374151')
        )

    def add_title_page(self):
        """Add the title page"""
        self.story.append(Spacer(1, 2*inch))
        
        title = Paragraph("Car Price Predictor", self.title_style)
        self.story.append(title)
        self.story.append(Spacer(1, 0.5*inch))
        
        subtitle = Paragraph("Technical Documentation Report", 
                            ParagraphStyle('subtitle', parent=self.styles['Normal'],
                                         fontSize=18, alignment=TA_CENTER,
                                         textColor=HexColor('#6b7280')))
        self.story.append(subtitle)
        self.story.append(Spacer(1, 1*inch))
        
        # Key metrics table
        metrics_data = [
            ['Metric', 'Value'],
            ['ML Accuracy', '98.3%'],
            ['Response Time', '< 3 seconds'],
            ['Features Analyzed', '87+'],
            ['Deployment Status', 'Production Ready']
        ]
        
        metrics_table = Table(metrics_data, colWidths=[2*inch, 2*inch])
        metrics_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), HexColor('#2563eb')),
            ('TEXTCOLOR', (0, 0), (-1, 0), white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), HexColor('#f8fafc')),
            ('GRID', (0, 0), (-1, -1), 1, black)
        ]))
        
        self.story.append(metrics_table)
        self.story.append(Spacer(1, 1*inch))
        
        date_text = Paragraph(f"Generated: {datetime.now().strftime('%B %d, %Y')}", 
                            ParagraphStyle('date', parent=self.styles['Normal'],
                                         fontSize=12, alignment=TA_CENTER,
                                         textColor=HexColor('#6b7280')))
        self.story.append(date_text)
        self.story.append(PageBreak())

    def add_executive_summary(self):
        """Add executive summary section"""
        self.story.append(Paragraph("Executive Summary", self.heading_style))
        
        summary_text = """
        The Car Price Predictor is a comprehensive AI-powered web application that provides instant, 
        accurate car valuations using advanced machine learning technology. Built with modern web 
        technologies including Next.js, FastAPI, and Docker, the platform delivers 98.3% prediction 
        accuracy through a sophisticated CatBoost machine learning model trained on 87+ vehicle features.
        
        The platform successfully combines cutting-edge machine learning with modern web technologies, 
        featuring a production-ready deployment on the CarUbuntu server with enterprise-grade security, 
        comprehensive pricing strategies, and scalable architecture designed for future growth.
        """
        
        self.story.append(Paragraph(summary_text, self.styles['Normal']))
        self.story.append(Spacer(1, 0.3*inch))

    def add_architecture_section(self):
        """Add technical architecture section"""
        self.story.append(Paragraph("Technical Architecture", self.heading_style))
        
        # System Overview
        self.story.append(Paragraph("System Overview", self.subheading_style))
        arch_text = """
        The Car Price Predictor follows a modern microservices architecture with clear separation 
        of concerns. The system consists of a Next.js frontend, FastAPI backend, Nginx load balancer, 
        and CatBoost machine learning model, all containerized using Docker for scalability and reliability.
        """
        self.story.append(Paragraph(arch_text, self.styles['Normal']))
        
        # Technology Stack Table
        self.story.append(Paragraph("Technology Stack", self.subheading_style))
        
        tech_data = [
            ['Component', 'Technology', 'Purpose'],
            ['Frontend', 'Next.js 14, TypeScript, Tailwind CSS', 'User Interface & Experience'],
            ['Backend', 'FastAPI, Python, CatBoost', 'API & Machine Learning'],
            ['Database', 'MongoDB, Mongoose ODM', 'Data Storage & Management'],
            ['Infrastructure', 'Docker, Nginx, Ubuntu', 'Deployment & Scaling'],
            ['Security', 'SSL/HTTPS, OAuth, Rate Limiting', 'Protection & Authentication']
        ]
        
        tech_table = Table(tech_data, colWidths=[1.5*inch, 2.5*inch, 2.5*inch])
        tech_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), HexColor('#2563eb')),
            ('TEXTCOLOR', (0, 0), (-1, 0), white),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), HexColor('#f8fafc')),
            ('GRID', (0, 0), (-1, -1), 1, black),
            ('VALIGN', (0, 0), (-1, -1), 'TOP')
        ]))
        
        self.story.append(tech_table)
        self.story.append(Spacer(1, 0.3*inch))

    def add_features_section(self):
        """Add features documentation section"""
        self.story.append(Paragraph("Key Features & Functionality", self.heading_style))
        
        # Core Features
        features_text = """
        <b>AI-Powered Price Prediction:</b> Advanced CatBoost machine learning model analyzing 87+ 
        vehicle features to deliver 98.3% prediction accuracy with confidence intervals.
        
        <b>VIN Lookup Service:</b> Automatic vehicle data population through NHTSA database integration 
        with 17-character VIN validation and seamless transition to price prediction.
        
        <b>Market Statistics Dashboard:</b> Real-time market data analysis with price trend insights, 
        regional market information, and interactive charts for comprehensive market understanding.
        
        <b>User Authentication System:</b> Secure Google OAuth integration with NextAuth.js, session 
        management, and subscription status tracking for personalized user experiences.
        """
        
        self.story.append(Paragraph(features_text, self.styles['Normal']))
        self.story.append(Spacer(1, 0.3*inch))

    def add_pricing_implementation(self):
        """Add recent pricing page implementation details"""
        self.story.append(Paragraph("Recent Pricing Page Implementation", self.heading_style))
        
        pricing_text = """
        On July 29, 2025, a comprehensive pricing page was implemented featuring three subscription 
        tiers designed to meet diverse user needs from individual buyers to enterprise clients.
        """
        self.story.append(Paragraph(pricing_text, self.styles['Normal']))
        
        # Pricing Tiers Table
        pricing_data = [
            ['Plan', 'Price', 'Key Features'],
            ['Basic', '$9.99/month', '10 predictions, Basic VIN lookup, Email support'],
            ['Premium', '$24.99/month', 'Unlimited predictions, Advanced analytics, API access'],
            ['Enterprise', '$99.99/month', 'Unlimited everything, Custom integrations, 24/7 support']
        ]
        
        pricing_table = Table(pricing_data, colWidths=[1.5*inch, 1.5*inch, 3.5*inch])
        pricing_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), HexColor('#2563eb')),
            ('TEXTCOLOR', (0, 0), (-1, 0), white),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), HexColor('#f8fafc')),
            ('GRID', (0, 0), (-1, -1), 1, black),
            ('VALIGN', (0, 0), (-1, -1), 'TOP')
        ]))
        
        self.story.append(pricing_table)
        self.story.append(Spacer(1, 0.2*inch))
        
        payment_text = """
        <b>Payment Integration:</b> Professional payment interface prepared for both Stripe and PayPal 
        integration, featuring enterprise-grade security, international payment support, and clear 
        "Coming Soon" indicators to set proper user expectations while maintaining engagement.
        """
        self.story.append(Paragraph(payment_text, self.styles['Normal']))

    def add_deployment_section(self):
        """Add deployment and infrastructure section"""
        self.story.append(Paragraph("Deployment & Infrastructure", self.heading_style))
        
        deployment_text = """
        <b>Production Environment:</b> Deployed on CarUbuntu server (157.245.142.242) with Docker 
        containerization, Nginx load balancing, and automated SSL certificate management through Let's Encrypt.
        
        <b>Security Implementation:</b> Enterprise-grade security featuring HTTPS encryption, rate limiting 
        (10 req/s for API, 30 req/s general), CORS protection, and comprehensive input validation.
        
        <b>Monitoring & Health Checks:</b> Automated container health monitoring with 30-second intervals, 
        service status endpoints, and real-time performance tracking for 99.9% uptime reliability.
        
        <b>Scalability Features:</b> Container-based architecture ready for horizontal scaling, load 
        distribution through Nginx, database connection pooling, and multi-layer caching strategy.
        """
        
        self.story.append(Paragraph(deployment_text, self.styles['Normal']))

    def add_future_roadmap(self):
        """Add future development roadmap"""
        self.story.append(Paragraph("Future Development Roadmap", self.heading_style))
        
        roadmap_text = """
        <b>Phase 1 - Payment Integration (Q3 2025):</b> Complete Stripe and PayPal checkout implementation, 
        subscription management system, customer portal development, and webhook processing.
        
        <b>Phase 2 - Mobile & API Expansion (Q4 2025):</b> React Native mobile application, public API 
        for developers, advanced analytics dashboard, and bulk processing capabilities.
        
        <b>Phase 3 - Scale & Enterprise (Q1 2026):</b> Kubernetes deployment, international market 
        expansion, white-label solutions, and enterprise partnership program.
        
        <b>Future Innovations:</b> Computer vision for vehicle assessment, blockchain integration for 
        vehicle history verification, AI-powered market predictions, and IoT integration for real-time data.
        """
        
        self.story.append(Paragraph(roadmap_text, self.styles['Normal']))

    def add_conclusion(self):
        """Add conclusion section"""
        self.story.append(Paragraph("Conclusion", self.heading_style))
        
        conclusion_text = """
        The Car Price Predictor represents a sophisticated, production-ready web application that 
        successfully combines cutting-edge machine learning with modern web technologies. The recent 
        implementation of the comprehensive pricing page and payment integration preparations positions 
        the platform for successful monetization while maintaining the high-quality user experience 
        that drives the core prediction functionality.
        
        With 98.3% ML model accuracy, enterprise-grade security, scalable Docker architecture, and 
        a clear roadmap for future development, the platform is well-positioned for continued growth 
        and market leadership in AI-powered automotive valuation solutions.
        """
        
        self.story.append(Paragraph(conclusion_text, self.styles['Normal']))

    def generate_pdf(self):
        """Generate the complete PDF report"""
        print("Generating Car Price Predictor Technical Documentation PDF...")
        
        # Add all sections
        self.add_title_page()
        self.add_executive_summary()
        self.add_architecture_section()
        self.add_features_section()
        self.add_pricing_implementation()
        self.add_deployment_section()
        self.add_future_roadmap()
        self.add_conclusion()
        
        # Build the PDF
        self.doc.build(self.story)
        print(f"PDF report generated successfully: {self.filename}")

if __name__ == "__main__":
    generator = PDFReportGenerator()
    generator.generate_pdf()
