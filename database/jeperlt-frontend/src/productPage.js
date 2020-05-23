import React, { Component } from 'react';
import { getProducts } from './facade/productFacade'
import { addToCart, getBasket, clearBasket } from './facade/basketFacade'
import { Button, Table, Row, Col, Modal, Form } from 'react-bootstrap';

export default class ProductPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      products: [],
      basket: [],
      showLogin: false,
      showCreditcard: false,
      loggedIn: null
    };
  }

  async componentWillMount() {
    this.setState({ products: await getProducts(1) });
    this.setState({ basket: await getBasket() });
  }

  addToCart = async (product) => {
    let basket = await addToCart(product);
    this.setState({ basket });
  }
  buyBasket = async () => {
    this.setState({ showLogin: true });
  }

  login = (name, phoneNumber) => {
    this.setState({ person: { name, phoneNumber }, showCreditcard: true });

  }


  render() {
    let handleLoginModalClose = () => {
      this.setState({ showLogin: false });
    }
    let handleCreditCardModalClose = () => {
      this.setState({ showCreditcard: false });
    }
    return (
      <div>
        <LoginModal loginCallback={this.login} showLogin={this.state.showLogin} handleCloseModal={handleLoginModalClose} />
        <CreditcardModal showModal={this.state.showCreditcard} handleCloseModal={handleCreditCardModalClose} />
        <Row>
          <Col xs={3} >
            <BasketTable basket={this.state.basket} clearBasketCallback={() => {
              this.setState({ basket: [] });
              clearBasket();
            }} />
            <Button style={{ marginTop: "40px" }} onClick={this.buyBasket}>Buy</Button>
          </Col>
          <Col xs={6}>
            <ProductTable products={this.state.products} addToCartCallback={(product) => {
              this.addToCart(product);
            }} />
          </Col>
        </Row >
      </div>
    )
  }
}

class CreditcardModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      verificationCode: "",
      cardNumber: "",
      expirationDate: ""
    }
  }

  // verificationCode,
  // cardNumber,
  // expirationDate

  render() {
    let { showModal, handleCloseModal } = this.props;
    return (
      <Modal show={showModal} onHide={handleCloseModal} >
        <Modal.Header closeButton>
          <Modal.Title>Creditcard info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Card number</Form.Label>
              <Form.Control
                onChange={(e) => this.setState({ cardNumber: e.target.value })}
                value={this.state.cardNumber}
                type="text"
                placeholder="Card number" />
            </Form.Group>
            
            <Form.Group>
              <Form.Label>Expiration date</Form.Label>
              <Form.Control
                onChange={(e) => this.setState({ expirationDate: e.target.value })}
                value={this.state.expirationDate}
                type="text"
                placeholder="Expiration date" />
            </Form.Group>

            <Form.Group>
              <Form.Label>Verification code</Form.Label>
              <Form.Control
                onChange={(e) => this.setState({ verificationCode: e.target.value })}
                value={this.state.verificationCode}
                type="text"
                placeholder="Verification code" />
            </Form.Group>
          </Form>


        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={(e) => {
            e.preventDefault();
            console.log(this.state);
            handleCloseModal();
          }}>
            Make order
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}



class LoginModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      phoneNumber: "",
      name: ""
    }
  }

  render() {
    let { showLogin, handleCloseModal, loginCallback } = this.props;
    return (
      <Modal show={showLogin} onHide={handleCloseModal} >
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Name</Form.Label>
              <Form.Control onChange={(e) => this.setState({ name: e.target.value })} value={this.state.name} type="text" placeholder="Name" />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Phonenumber</Form.Label>
              <Form.Control onChange={(e) => this.setState({ phoneNumber: e.target.value })} value={this.state.phoneNumber} type="number" placeholder="Phonenumber" />
            </Form.Group>
          </Form>


        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={(e) => {
            e.preventDefault();
            console.log(this.state);
            loginCallback(this.state.name, this.state.phoneNumber);
            handleCloseModal();
          }}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

function ProductTable({ products, addToCartCallback }) {
  let productTable = products.map((product, index) => {
    return (
      <tr key={index}>
        <td> {product.brand} </td>
        <td> {product.size} </td>
        <td> {product.evo} </td>
        <td> {product.madeIn} </td>
        <td> {product.product} </td>
        <td> {product.price} </td>
        <td> <Button onClick={(event) => {
          event.preventDefault();
          addToCartCallback(product)
        }} >Add to cart</Button> </td>
      </tr>
    )
  })
  return (
    <Table striped bordered hover variant="striped bordered hover">
      <thead>
        <tr>
          <th>Brand</th>
          <th>Size</th>
          <th>Evo</th>
          <th>Made in</th>
          <th>Product name</th>
          <th>Price</th>
          <th>Order</th>
        </tr>
      </thead>
      <tbody>
        {productTable}
      </tbody>
    </Table>
  );
}

function BasketTable({ basket, clearBasketCallback }) {
  let totalBasketPrice = 0;
  let basketTable = basket.map((product, index) => {
    totalBasketPrice += product.price;
    return (
      <tr key={index}>
        <td>{product.brand}</td>
        <td>{product.product}</td>
        <td>{product.price}</td>
      </tr>
    )
  });

  return (
    <div>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Brand</th>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {basketTable}
        </tbody>
      </Table>
      <h3>
        Total price: {totalBasketPrice}
      </h3>
      <Button onClick={clearBasketCallback}>Clear basket</Button>
    </div>
  );

}