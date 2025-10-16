import { Box, Heading, BodyShort, HelpText } from '@navikt/ds-react';

interface MetricCardProps {
  value: string | number;
  label: string;
  helpText: string;
  helpTitle: string;
  background: 'surface-action-selected' | 'surface-success' | 'surface-warning' | 'surface-info';
  textColor: string;
}

export default function MetricCard({
  value,
  label,
  helpText,
  helpTitle,
  background,
  textColor
}: MetricCardProps) {
  return (
    <Box background={background} padding="6" borderRadius="large">
      <div className="text-white">
        <Heading size="xlarge" level="2" className="mb-2 text-white">
          {value}
        </Heading>
        <div className="flex items-center gap-2">
          <BodyShort className={textColor}>{label}</BodyShort>
          <span className="[&_button]:text-white [&_button_svg]:text-white [&_.navds-popover__content]:text-gray-900">
            <HelpText title={helpTitle} placement="top">
              {helpText}
            </HelpText>
          </span>
        </div>
      </div>
    </Box>
  );
}
