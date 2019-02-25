import React from "react";
import { shallow } from "enzyme";
import TransactionToastUtil from "./TransactionToastUtil";

describe("TransactionToastUtil", () => {
  const componentProps = {
    tx1551107396364: {
      created: 1551107396364,
      lastUpdated: 1551107430741,
      status: "success",
      confirmationCount: 24,
      method: "incrementCounter",
      type: "contract",
      transactionHash:
        "0x18c56dc171eb8e6f95d0489c8e18a8fde95ee1b8350a624abaa17d2872894f41",
      recentEvent: "receipt"
    },
    tx1551107423018: {
      created: 1551107423018,
      lastUpdated: 1551107462155,
      status: "success",
      confirmationCount: 24,
      method: "incrementCounter",
      type: "contract",
      transactionHash:
        "0xfe92a2e59ef090df835b48a3795eb4f80e8673b0ce1ce3f4aa060dcbc6a26f7a",
      recentEvent: "receipt"
    },
    tx1551107428376: {
      created: 1551107428376,
      lastUpdated: 1551107462064,
      status: "success",
      confirmationCount: 24,
      method: "incrementCounter",
      type: "contract",
      transactionHash:
        "0xb3f476d68a7148de593bf758d9a449ffbb2da994f14ae0e97695872432d94908",
      recentEvent: "receipt"
    },
    tx1551107627514: {
      created: 1551107627514,
      lastUpdated: 1551107631111,
      status: "pending",
      confirmationCount: 0,
      method: "incrementCounter",
      type: "contract"
    }
  };

  const updatedProps = {
    tx1551107396364: {
      created: 1551107396364,
      lastUpdated: 1551107430741,
      status: "success",
      confirmationCount: 24,
      method: "incrementCounter",
      type: "contract",
      transactionHash:
        "0x18c56dc171eb8e6f95d0489c8e18a8fde95ee1b8350a624abaa17d2872894f41",
      recentEvent: "receipt"
    },
    tx1551107423018: {
      created: 1551107423018,
      lastUpdated: 1551107462155,
      status: "success",
      confirmationCount: 24,
      method: "incrementCounter",
      type: "contract",
      transactionHash:
        "0xfe92a2e59ef090df835b48a3795eb4f80e8673b0ce1ce3f4aa060dcbc6a26f7a",
      recentEvent: "receipt"
    },
    tx1551107428376: {
      created: 1551107428376,
      lastUpdated: 1551107462064,
      status: "success",
      confirmationCount: 24,
      method: "incrementCounter",
      type: "contract",
      transactionHash:
        "0xb3f476d68a7148de593bf758d9a449ffbb2da994f14ae0e97695872432d94908",
      recentEvent: "receipt"
    },
    tx1551107627514: {
      created: 1551107627514,
      lastUpdated: 1551107639999,
      status: "pending",
      confirmationCount: 0,
      method: "incrementCounter",
      type: "contract"
    }
  };

  it("renders children", () => {
    const wrapper = shallow(<TransactionToastUtil />);
    expect(wrapper).toMatchSnapshot();
  });
});
