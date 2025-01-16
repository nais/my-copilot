'use client';

import React, { useState, useEffect } from "react";
import { Button } from "@navikt/ds-react";

interface SubscriptionDetailsProps {
  icanhazcopilot: boolean;
  subscription: {
    plan_type: string;
    pending_cancellation_date: string | null;
    updated_at: string | null;
    last_activity_at: string | null;
    last_activity_editor: string;
  };
}

async function updateCopilotSubscription(action: 'activate' | 'deactivate') {
  return await fetch('/api/copilot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action }),
  });
}

const SubscriptionActionButton: React.FC<{ subscription: SubscriptionDetailsProps['subscription'], onClick: () => void }> = ({ subscription, onClick }) => {
  let buttonColor: 'secondary' | 'primary' | 'primary-neutral' | 'secondary-neutral' | 'tertiary' | 'tertiary-neutral' | 'danger' | undefined = 'secondary';
  let buttonText: string;

  if (subscription.pending_cancellation_date) {
    buttonColor = 'danger';
    buttonText = 'Kanseller Copilot...';
  } else if (subscription.updated_at) {
    buttonColor = 'danger';
    buttonText = 'Deaktiver Copilot';
  } else {
    buttonColor = 'primary';
    buttonText = 'Aktiver Copilot';
  }

  return (
    <Button variant={buttonColor} onClick={onClick}>
      {buttonText}
    </Button>
  );
};

const SubscriptionDetails: React.FC = () => {
  const [eligibility, setEligible] = useState<boolean>(false);
  const [subscription, setCopilotSubscription] = useState<SubscriptionDetailsProps['subscription'] | null>(null);

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/copilot');
      const data = await response.json();
      setEligible(data.icanhazcopilot);
      setCopilotSubscription(data.subscription);
    } catch (error) {
      console.error('Error fetching subscription details:', error);
    }
  };

  const handleClick = async () => {
    if (eligibility) {
      if (subscription?.updated_at && !subscription?.pending_cancellation_date) {
        console.log('Deactivating subscription...');
        try {
          const response = await updateCopilotSubscription('deactivate');
          const data = await response.json();
          if (data.error) {
            console.error('Error deactivating subscription:', data.error);
          } else {
            console.log('Subscription deactivated successfully:', data);
          }
        } catch (error) {
          console.error('Error:', error);
        } finally {
          fetchSubscription();
        }
      } else {
        console.log('Activating subscription...');
        try {
          const response = await updateCopilotSubscription('activate');
          const data = await response.json();
          if (data.error) {
            console.error('Error activating subscription:', data.error);
          } else {
            console.log('Subscription activated successfully:', data);
          }
        } catch (error) {
          console.error('Error:', error);
        } finally {
          fetchSubscription();
        }
      }
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  return (
    <div>
      {subscription && eligibility ? (
        <>
          <p className="mb-2">
            <strong>Plan:</strong> {subscription.plan_type === 'business' ? 'Bedriftsplan' : 'Individuell Plan'}
          </p>
          <p className="mb-2">
            <strong>Status:</strong> {subscription.pending_cancellation_date ? 'Kansellering Pågår' : subscription.updated_at ? 'Aktiv' : 'Inaktiv'}
          </p>
          <p className="mb-2">
            <strong>Sist Oppdatert:</strong> {new Date(subscription.updated_at ?? '').toLocaleDateString()}
          </p>
          <p className="mb-2">
            <strong>Siste Aktivitet:</strong> {new Date(subscription.last_activity_at ?? '').toLocaleDateString()}
          </p>
          <p className="mb-2">
            <strong>Siste Aktivitet Editor:</strong> {subscription.last_activity_editor}
          </p>
          <SubscriptionActionButton subscription={subscription} onClick={handleClick} />
        </>
      ) : subscription && !eligibility ? (
        <p>Du har ikke tilgang til å få GitHub Copilot nå. GitHub Copilot er bare tilgjengelig for ansatte og konsulenter i Utvikling og Data.</p>
      ) : (
        <div role="status" className="max-w-sm animate-pulse">
          <div className="h-6 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
          <div className="h-5 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
          <div className="h-5 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
          <div className="h-5 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
          <div className="h-5 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
          <div className="h-5 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
          <span className="sr-only">Loading...</span>
        </div>
      )}
    </div >
  );
};

export default SubscriptionDetails;