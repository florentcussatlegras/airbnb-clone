import { EmptyState } from '../components/EmptyState';
import { ClientOnly } from '../components/ClientOnly';

import getCurrentUser from '../actions/getCurrentUser';
import getReservations from '../actions/getReservations';
import TripsClient from './TripsClient';

const TripsPage = async() => {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return (
            <ClientOnly>
                <EmptyState
                    title="Accés refusé"
                    subtitle="Veuillez vous identifiez"
                />
            </ClientOnly>
        );
    }

    const reservations = await getReservations({
        userId: currentUser.id
    });

    if (reservations.length === 0) {
        return (
            <ClientOnly>
                <EmptyState
                    title="Aucun voyage trouvé"
                    subtitle="Il semble que vous n'avez réversé aucun voyage."
                />
            </ClientOnly>
        )
    }

    return (
        <ClientOnly>
            <TripsClient 
                reservations={reservations}
                currentUser={currentUser}
            />
        </ClientOnly>
    );
}

export default TripsPage;
