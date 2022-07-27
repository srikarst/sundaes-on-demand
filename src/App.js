import Container from "react-bootstrap/Container";
import OrderEntry from "./pages/entry/OrderEntry";
import { OrderDetailsProvider } from "./contexts/OrderDetails";

function App() {
  return (
    <Container>
      <OrderDetailsProvider>
        {/* Summary page and Entry page need Provider */}
        <OrderEntry />
      </OrderDetailsProvider>
      {/* Confirmation page does not need Provider */}
    </Container>
  );
}

export default App;
