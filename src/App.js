import React, { Component } from "react";
import { Form, Input, Button, notification, Card, PageHeader, Spin } from 'antd';
import axios from 'axios';
import { LoadingOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sending: false,
    };
  }

  validateEmails(rule, value, callback) {
    let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (value) {
      const emails = value.split(',');
      const invalid_emails = [];
      emails.forEach(email => {
        if (!regEmail.test(email)) {
          invalid_emails.push(email);
        }
      });
      if (invalid_emails.length > 0) {
        return callback(`Please look into these emails - ${invalid_emails.join(', ')}. These doest not seem to be valid`);
      }
    }
    callback();
  }

  render() {
    const { TextArea } = Input;
    const antIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />;
    const tailLayout = {
      wrapperCol: {
        offset: 8,
        span: 16,
      },
    };
    const onFinish = (values) => {
      this.setState({ sending: true });
      axios.post("/send-email", values)
        .then((res) => {
          this.setState({ sending: false });
          notification.success({
            message: 'Success!',
            description:
              'Emails Sent Successfully'
          });
        }).catch((err) => {
          this.setState({ sending: false });
          notification.error({
            message: 'Error!',
            description:
              'Error occurred while sending emails'
          });
        })
    };

    return (
      <div className="page-container">
        <PageHeader className="site-page-header" title="Email Sender App" />
        <div className="email-form">
          {this.state.sending && (<div className="loading">
            <Spin indicator={antIcon} tip="Sending Email..." />
          </div>)}

          <Card hoverable>
            <Form
              name="basic"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              layout="vertical"
            >
              <Form.Item
                label="To"
                name="emails"
                rules={[
                  {
                    required: true,
                    message: 'Please enter atleast one email address',
                  },
                  {
                    validator: this.validateEmails,
                  }
                ]}
                validateTrigger='onBlur'
              >
                <TextArea disabled={this.state.sending} autoSize placeholder="Enter comma seperated email addresses" />
              </Form.Item>

              <Form.Item
                label="Subject"
                name="subject"
                initialValue=""
              >
                <Input disabled={this.state.sending} placeholder="Write your Subject" />
              </Form.Item>

              <Form.Item
                label="Body"
                name="body"
                rules={[
                  {
                    required: true,
                    message: 'Please enter body of the email',
                  }
                ]}
              >
                <TextArea disabled={this.state.sending} placeholder="Enter body of email" />
              </Form.Item>

              <Form.Item {...tailLayout}>
                <Button disabled={this.state.sending} type="primary" htmlType="submit" size="large">
                  Send Email
                </Button>
              </Form.Item>
            </Form>
          </Card>

        </div>
      </div>

    );
  }

}

